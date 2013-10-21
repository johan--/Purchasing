var attr = DS.attr;

App.Receiving = DS.Model.extend({
  total: attr(),
  last_user: attr(),
  created_at: attr(),
  updated_at: attr(),

  purchases: DS.belongsTo('purchase'),
  receivingLines: DS.hasMany('receivingLine')
});

App.ReceivingAdapter = DS.RESTAdapter.extend();
