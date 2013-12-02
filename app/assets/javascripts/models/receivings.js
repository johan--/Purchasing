var attr = DS.attr;

App.Receiving = DS.Model.extend({
  total: attr(),
  package_num: attr(),
  package_date: attr(),
  last_user: attr(),
  created_at: attr(),
  updated_at: attr(),
  destroy: attr(),

  purchase: DS.belongsTo('purchase'),
  receivingLines: DS.hasMany('receivingLine'),

  totalCount: function() {
    return this.get('receivingLines').reduce(function(sum, line){
      return sum + (line.get('quantity') || 0);
    }, 0);
  }.property('receivingLines.@each.quantity'),


  priceTotal: function() {
    return toCurrency(this.get('receivingLines').reduce(function(sum, line){
      return sum + line.get('lineItemTotal') || 0;
    }, 0));
  }.property('receivingLines.@each.lineItemTotal'),


  rollbackWithChildren: function() {
    this.rollback();

    this.get('receivingLines').forEach(function(line){
      if (Ember.isEmpty(line))
        line.deleteRecord();
      else
        line.rollback();
    });
  }

});

App.ReceivingAdapter = DS.RESTAdapter.extend();
App.ReceivingSerializer = App.SerializeMyChildren.extend();
