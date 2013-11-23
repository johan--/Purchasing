var attr = DS.attr;

App.Account = DS.Model.extend({
  number: attr(),
  destroy: attr(),
  user_id: attr(),
  number_purchases: attr(),

  purchases: DS.hasMany('purchase'),
  user: DS.belongsTo('user')
});

App.AttachmentAdapter = DS.RESTAdapter.extend();
