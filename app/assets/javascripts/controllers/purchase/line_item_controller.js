App.LineItemController = Ember.ObjectController.extend({


  currentReceivingHoverDoc: function() {
    return this.get('parentController.currentReceivingHoverDoc');
  }.property('parentController.currentReceivingHoverDoc'),


  currentReceivingDoc: function() {
    return this.get('parentController.currentReceivingDoc');
  }.property('parentController.currentReceivingDoc'),


  isHovering: function() {
    var doc = this.get('parentController.currentReceivingHoverDoc');
    if (doc)
      return $.inArray(this.get('model.id'), doc.lineIds()) > -1;
  }.property('parentController.currentReceivingHoverDoc'),


  // Is this line item in that receiving doc?
  thisIsReceiving: function() {
    return !isEmpty(this.getMyReceivingLineInCurrentDoc());
  }.property('parentController.currentReceivingDoc', 'receivingLines.@each'),


  // Does the parent controller have a receiving doc?
  isReceiving: function() {
    return this.get('parentController.isReceiving');
  }.property('parentController.isReceiving'),


  // Field for template
  curReceivedHoverCount: function() {
    var doc = this.get('parentController.currentReceivingHoverDoc'),
        myReceivings = this.get('receivingLines');

    if (doc) {
      var doc_id = doc.id;
      var curCount = null;

      myReceivings.forEach(function(item){
        if (item.get('receiving.id') === doc_id)
          curCount = item.get('quantity');
      });

      return curCount;
    }
  }.property('parentController.currentReceivingHoverDoc'),


  // Total # of items received on the current receiving doc
  curReceivedCount: function() {
    var curDoc = this.getMyReceivingLineInCurrentDoc();

    if (curDoc === null)
      return 0;
    else
      return curDoc.get('quantity') || 0;
  }.property('parentController.currentReceivingDoc', 'receivingLines.@each.quantity'),


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


  overQuantity: function() {
    var quantity = this.get('quantity'),
        received = this.get('receivedCount');

    if (quantity == received)
      return 'full-received';
    else if (quantity < received)
      return 'over-received';
    else if (received < 0)
      return 'over-received';
    else if (received !== 0)
      return 'partial-received';
    else
      return false;
  }.property('quantity', 'receivedCount'),


  actions: {
    receivingIncrement: function(amount) {
      this.incrementReceiving(amount);
    }
  },


  incrementReceiving: function(amount) {
    var application = this.get('application');

    // See if it exists
    curLine = this.getMyReceivingLineInCurrentDoc();
    if (curLine === null) {

      // Create it and try again
      this.addReceivingLine();
      curLine = this.getMyReceivingLineInCurrentDoc();

      if (curLine === null) {
        application.notify({ message: 'There was an internal error creating a receiving line', type: 'error' });
        return;
      }
    }

    curLine.set('quantity', (curLine.get('quantity') || 0) + amount);
  },


  // Create a new receiving line
  addReceivingLine: function() {
    var receivingDoc = this.get('currentReceivingDoc'),
        record = this.get('content'),
        newDoc = this.store.createRecord('receivingLine');

    receivingDoc.get('receivingLines').addObject(newDoc);
    receivingDoc.send('becomeDirty');
    record.get('receivingLines').addObject(newDoc);
  },


  // Scan current lines for doc id (don't scan the other way so that hover observers work)
  getMyReceivingLineInCurrentDoc: function() {
    var rec_doc = this.get('parentController.currentReceivingDoc'),
        lines = this.get('receivingLines');

    if (isEmpty(rec_doc) || isEmpty(lines))
      return null;

    lineDoc = null;
    lines.forEach(function(line){
      if (line.get('receiving.id') == rec_doc.id)
        lineDoc = line;
    });

    return lineDoc;
  },


  lineNumber: function(key, value) {
    var model = this.get('model');
    if (isEmpty(value)) {
      return model.get('lineNumber');
    } else {
      model.set('lineNumber', value);
      return value;
    }
  }.property('model.lineNumber')

});
