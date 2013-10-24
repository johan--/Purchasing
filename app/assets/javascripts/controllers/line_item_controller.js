App.LineItemController = Ember.ObjectController.extend({

  isEditing: false,

  isHighlighted: function(key, value) {
    model = this.get('model');
    if (value == undefined) {
      return model.get('isHighlighted');
    } else {
      model.set('isHighlighted', value);
      model.save();
      return value;
    }

  }.property('model.isHighlighted'),

  receivedCount: function() {
    var receivingLines = this.get("receivingLines");  // TODO Failing
    return receivingLines.reduce(0, function(res, line){
      return res + parseInt(line.get("quantity"));
    });
  }.property('receivingLines.@each.quantity'),

  countsField: function() {
    return this.get('receivingLines').get('length');

    /*
    var quantity = this.get('quantity'),
        received = this.get('receivedCount');
    if (this.get('isEditing')) {
      var cur_line = 0; // Current receiving doc being edited
      return;
    } else {
      return quantity + ' / ' + received;
    }
    */
  }.property('receivingLines'),

  extendedCost: function() {
    var quantity = toNumber(this.get('quantity')),
        price = toNumber(this.get('price'));
    return toCurrency(quantity * price);
  }.property('quantity', 'price'),

});
