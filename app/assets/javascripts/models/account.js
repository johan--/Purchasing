var attr = DS.attr;

App.Account = DS.Model.extend({
  number: attr(),
  destroy: attr(),
  user_id: attr(),

  purchases: DS.hasMany('purchase')
});

App.AttachmentAdapter = DS.RESTAdapter.extend();
