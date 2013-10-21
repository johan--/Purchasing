var attr = DS.attr;

App.Purchase = DS.Model.extend({
  starred: attr(),
  date_requested: attr('date'),
  date_approved: attr('date'),
  date_purchased: attr('date'),
  date_expected: attr('date'),
  date_required: attr('date'),
  date_received: attr('date'),
  date_reconciled: attr('date'),
  tags: DS.hasMany('tag'),
  lineItems: DS.hasMany('lineItem'),
  vendors: DS.hasMany('vendor'),
  buyer: attr(),
  requester: attr(),
  recipient: attr()

});

App.PurchaseAdapter = DS.RESTAdapter.extend();
