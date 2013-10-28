App.LineItemController = Ember.ObjectController.extend({
  needs: 'receiving_lines',

  isEditing: false,

  isHighlighted: function(key, value) {
    var model = this.get('model');
    if (Ember.isEmpty(value)) {
      return model.get('isHighlighted');
    } else {
      model.set('isHighlighted', value);
      model.save();
      return value;
    }

  }.property('model.isHighlighted'),

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
    var lines = this.get('receivingLines');
    var res = 0;
    lines.forEach(function(cur){
      res += cur.get('quantity');
    });
    return res;
  },

  twoCountsField: function() {
    var received = this.receivedCount();
    var quantity = this.get('quantity');

    if (this.get('isEditing')) {
      return;

    } else {
      return quantity + ' / ' + received;
    }
  }.property('receivingLines', 'quantity'),

  threeCountsField: function() {
    var start = this.get('twoCountsField');
    var cur_rec_count = this.get('curRelatedRecDocCount');
    return start + '  (' + cur_rec_count + ')';
  }.property('receivingLines', 'quantity', 'curRelatedRecDocCount'),

  extendedCost: function() {
    var quantity = toNumber(this.get('quantity')),
        price = toNumber(this.get('price'));
    return toCurrency(quantity * price);
  }.property('quantity', 'price'),

});
