App.LineItemController = Ember.ObjectController.extend({
  needs: 'receiving_lines',

  isReceiving: function() {
    var rec_doc = this.get('purchase.currentReceivingDoc')
        isReceiving = false,
        myId = this.get('content').id;

    if (Ember.isEmpty(rec_doc))
      return false;

    rec_doc.get('receivingLines').forEach(function(line){
      console.log('-------');
      console.log(line);
      console.log(line.get('lineItem.id'));
      if (line.get('lineItem.id') == myId)
        isReceiving = true;
    });
    return isReceiving;
   }.property('purchase.currentReceivingDoc'), // add line_items.@each

  receiveField: function(key, value) {
    var model = this.get('model');
    if (Ember.isEmpty(value)) {
      return model.get('receiveField');
    } else {
      model.set('receiveField', value);
      model.save
      return value;
    }
  }.property('model.receiveField'),

  lineNumber: function(key, value) {
    var model = this.get('model');
    if (Ember.isEmpty(value)) {
      return model.get('lineNumber');
    } else {
      model.set('lineNumber', value);
      model.save
      return value;
    }
  }.property('model.lineNumber'),

  isHighlighted: function(key, value) {
    var model = this.get('model'),
        isEditing = this.get('isReceiving'),
        isHighlighted = model.get('isHighlighted'),
        rec_doc = this.get('purchase.currentReceivingDoc');

    if (Ember.isEmpty(value)) {

      if (!this.get('model.destroy')) {

        if (isEditing == true) {
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
  }.property('model.isHighlighted', 'isReceiving'),

  // Getter / Setter for Receiving document being edited
  curRelatedRecDocCount: function(key, value) {
    var model = this.get('model');
    if (Ember.isEmpty(value)) {
      return model.get('curRelatedRecDocCount');
    } else {
      model.set('curRelatedRecDocCount', value);
      model.save;
      return value;
    }
  }.property('model.curRelatedRecDocCount'),

  receivedCount: function() {
    var lines = this.get('receivingLines'),
        res = 0;
    lines.forEach(function(cur){
      res += cur.get('quantity');
    });
    return res;
  },

  received: function() {
    return received = this.receivedCount() || 0;
  }.property('receivingLines'),

  curReceived: function() {
    return this.get('curRelatedRecDocCount') || 0;
  }.property('curRelatedRecDocCount'),

  extendedCost: function() {
    var quantity = toNumber(this.get('quantity')) || 0,
        price = toNumber(this.get('price')) || 0;
    return toCurrency(quantity * price);
  }.property('quantity', 'price'),

});
