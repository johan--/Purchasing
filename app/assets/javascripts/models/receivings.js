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
  receivingLines: DS.hasMany('receivingLine')
});

App.ReceivingAdapter = DS.RESTAdapter.extend();
