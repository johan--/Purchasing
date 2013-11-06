App.LineItemController = Ember.ObjectController.extend({
  needs: 'receiving_lines',

  isHighlighted: function(key, value) {
    var model = this.get('model'),
        isReceiving = this.get('thisIsReceiving'),
        isHighlighted = model.get('isHighlighted'),
        rec_doc = this.get('purchase.currentReceivingDoc');

    if (Ember.isEmpty(value)) {

      if (!this.get('model.destroy')) {

        if (isReceiving == true) {
          if (isHighlighted == true)
            return 'is-edit-highlighted';
          else
            return 'is-editing';
        } else {
          if (isHighlighted == true)
            return 'is-highlighted'
        }
      }

    } else {
      model.set('isHighlighted', value);
      model.save();
      return value;
    }
  }.property('model.isHighlighted', 'thisIsReceiving'),

  // Does the parent controller have a receiving doc?
  isReceiving: function() {
    return !Ember.isEmpty(this.get('purchase.currentReceivingDoc'))
  }.property('purchase.currentReceivingDoc'),

  // Is this line item in that receiving doc?
  thisIsReceiving: function() {
    return !Ember.isEmpty(this.getMyReceivingLine());
   }.property('purchase.currentReceivingDoc', 'receivingLines.@each'),


  // Total # of items received
  receivedCount: function() {
    var lines = this.get('receivingLines'),
        res = 0;

    lines.forEach(function(cur){
      res += cur.get('quantity');
    });
    return res;
  }.property('receivingLines.@each.quantity'),

  // Total # of items received on the current receiving doc
  curReceivedCount: function() {
    var curDoc = this.getMyReceivingLine();

    if (curDoc == null)
      return 0;
    else
      return curDoc.get('quantity') || 0;
  }.property('purchase.currentReceivingDoc', 'receivingLines.@each.quantity'),

  // This is a static value from a hover
  curReceivedHoverCount: function() {
    return this.get('hoverReceivedCount');
  }.property('hoverReceivedCount'),


  extendedCost: function() {
    var quantity = toNumber(this.get('quantity')) || 0,
        price = toNumber(this.get('price')) || 0;
    return toCurrency(quantity * price);
  }.property('quantity', 'price'),


  actions: {
    receivingIncrement: function() {
      this.incrementReceiving(1); // TODO: long press
    },

    receivingDecrement: function() {
      this.incrementReceiving(-1);
    }

  },


  incrementReceiving: function(amount) {
    // See if it exists
    curLine = this.getMyReceivingLine();
    if (curLine == null) {

      // Create it and try again
      this.addReceivingLine();
      curLine = this.getMyReceivingLine();

      if (curLine == null) {
        console.log('error, failed at creating a new receiving_line for doc');
        return
      }
    }

    curLine.set('quantity', (curLine.get('quantity') || 0) + amount);
  },

  // Create a new receiving line
  addReceivingLine: function() {
    var receivingDoc = this.get('purchase.currentReceivingDoc'),
        record = this.get('content'),
        newDoc = this.store.createRecord('receivingLine');

    receivingDoc.get('receivingLines').addObject(newDoc);
    record.get('receivingLines').addObject(newDoc);
  },

  // Scan current lines for doc id (don't scan the other way so that hover observers work)
  getMyReceivingLine: function() {
    var rec_doc = this.get('purchase.currentReceivingDoc'),
        lines = this.get('receivingLines');

    if (Ember.isEmpty(rec_doc) || Ember.isEmpty(lines))
      return null;

    lineDoc = null;
    lines.forEach(function(line){
      if (line.get('receiving.id') == rec_doc.id)  // This will fail for second new receiving documents!!!!
        lineDoc = line;
    });

    return lineDoc;
  },


  lineNumber: function(key, value) {
    var model = this.get('model');
    if (Ember.isEmpty(value)) {
      return model.get('lineNumber');
    } else {
      model.set('lineNumber', value);
      model.save
      return value;
    }
  }.property('model.lineNumber')

});
