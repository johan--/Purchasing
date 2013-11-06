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
    var sum = 0;
    this.get('receivingLines').forEach(function(line){
      sum += (line.get('quantity') || 0);
    });
    return sum;
  }.property('receivingLines.@each.quantity')

});

App.ReceivingAdapter = DS.RESTAdapter.extend();
App.ReceivingSerializer = App.SerializeMyChildren.extend();
