App.LineItemController = Ember.ObjectController.extend({
  needs: 'receiving_lines',

  isEditing: false,

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
    var model = this.get('model');
    if (Ember.isEmpty(value)) {
      if (!this.get('model.destroy'))
        return model.get('isHighlighted');
    } else {
      model.set('isHighlighted', value);
      model.save();
      return value;
    }
  }.property('model.isHighlighted'),

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

  // Total ordered / received
  twoCountsField: function() {
    var received = this.receivedCount(),
        quantity = this.get('quantity') || 0;

    if (this.get('isEditing')) {
      return;
    } else {
      return quantity + ' / ' + received;
    }
  }.property('receivingLines', 'quantity'),

  // Total ordered / received / this receiving document
  threeCountsField: function() {
    var start = this.get('twoCountsField'),
        cur_rec_count = this.get('curRelatedRecDocCount');
    return start + '  (' + cur_rec_count + ')';
  }.property('receivingLines', 'quantity', 'curRelatedRecDocCount'),

  extendedCost: function() {
    var quantity = toNumber(this.get('quantity')) || 0,
        price = toNumber(this.get('price')) || 0;
    return toCurrency(quantity * price);
  }.property('quantity', 'price'),

});
