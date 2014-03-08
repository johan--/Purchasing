
App.LineItemController = Ember.ObjectController.extend({

  isHovering: function() {
    var doc = App.ReceivingGlobals.get('currentReceivingHoverDoc');

    if (doc)
      return $.inArray(this.get('model.id'), doc.get('lineIds')) > -1;
  }.property('App.ReceivingGlobals.currentReceivingHoverDoc'),


  // Field for template
  curReceivedHoverCount: function() {
    var doc = App.ReceivingGlobals.get('currentReceivingHoverDoc');

    if (doc)
      return this.get('receivingLines').filterBy('receiving.id', doc.id).get('lastObject.quantity');
  }.property('App.ReceivingGlobals.currentReceivingHoverDoc'),


  // Total # of items received on the current receiving doc
  curReceivedCount: function() {
    var curDoc = this._getMyReceivingLineInCurrentDoc();

    return (curDoc === null) ? 0 : (curDoc.get('quantity') || 0);
  }.property('App.ReceivingGlobals.currentReceivingDoc', 'receivingLines.@each.quantity'),


  // Class name for line item on purchase.edit when hovering a receiving doc
  highlightedClassName: function() {
    var model = this.get('model'),
        isReceiving = this.get('thisIsReceiving'),
        isHovering = this.get('isHovering');

    if (!this.get('model.isDestroy')) {
      if (isReceiving === true) {
        if (isHovering === true)
          return 'is-edit-highlighted';
        else
          return 'is-editing';
      } else {
        if (isHovering === true) {
          if (this.get('quantity') <= this.get('curReceivedHoverCount'))
            return 'is-highlighted-all';
          else
            return 'is-highlighted-partial';
        }
      }
    }
  }.property('isHovering', 'thisIsReceiving'),


  // Class for received count on purchase.edit
  receivedCountClass: function() {
    var quantity = this.get('quantity'),
        received = this.get('receivedCount');

    return this._buildClass(quantity, received);
  }.property('quantity', 'receivedCount'),


  // Class for received count on purchases hover (since it relies on server value)
  receivedCountPurchasesClass: function() {
    var quantity = this.get('quantity') || 0,
        received = this.get('received_count_server') || 0;

    return this._buildClass(quantity, received);
  }.property('quantity', 'received_count_server'),


  actions: {
    receivingIncrement: function(amount) {
      this.incrementReceiving(amount);
    }
  },


  incrementReceiving: function(amount) {
    var self = this,
        application = this.get('application');

    Ember.run(function() {

      // See if it exists
      var curLine = self._getMyReceivingLineInCurrentDoc();
      if (curLine === null) {

        // Create it and try again
        self._addReceivingLine();
        curLine = self._getMyReceivingLineInCurrentDoc();

        if (curLine === null) {
          application.notify({ message: 'There was an internal error creating a receiving line', type: 'error' });
          return;
        }
      }

      curLine.set('quantity', (curLine.get('quantity') || 0) + amount);

    });
  },


  // Create a new receiving line
  _addReceivingLine: function() {
    var receivingDoc = App.ReceivingGlobals.get('currentReceivingDoc'),
        record = this.get('content'),
        newDoc = this.store.createRecord('receivingLine');

    receivingDoc.get('receivingLines').addObject(newDoc);
    receivingDoc.send('becomeDirty');
    record.get('receivingLines').addObject(newDoc);
  },


  // Scan current lines for doc id (don't scan the other way so that hover observers work)
  _getMyReceivingLineInCurrentDoc: function() {
    var rec_doc = App.ReceivingGlobals.get('currentReceivingDoc'),
        lines = this.get('receivingLines');

    if (isEmpty(rec_doc) || isEmpty(lines))
      return null;

    var lineDoc = null;
    lines.forEach(function(line){
      if (line.get('receiving.id') === rec_doc.id)
        lineDoc = line;
    });

    return lineDoc;
  },


  _buildClass: function(quantity, received) {
    if (quantity === received)
      return 'full-received';
    else if (quantity < received)
      return 'over-received';
    else if (received < 0)
      return 'over-received';
    else if (received !== 0)
      return 'partial-received';
    else
      return false;
  }
});
