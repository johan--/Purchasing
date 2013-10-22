var attr = DS.attr;

App.Purchase = DS.Model.extend({
  starred: attr(),
  date_requested: attr(),
  date_approved: attr(),
  date_purchased: attr(),
  date_expected: attr(),
  date_required: attr(),
  date_received: attr(),
  date_reconciled: attr(),
  tags: DS.hasMany('tag'),
  lineItems: DS.hasMany('lineItem'),
  vendors: DS.hasMany('vendor'),
  buyer: attr(),
  requester: attr(),
  recipient: attr()

});

App.PurchaseAdapter = DS.RESTAdapter.extend();
