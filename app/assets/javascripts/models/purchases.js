var attr = DS.attr;

App.Purchase = DS.Model.extend({
  starred: attr(),
  dateRequested: attr(),
  dateApproved: attr(),
  datePurchased: attr(),
  dateExpected: attr(),
  dateRequired: attr(),
  dateReceived: attr(),
  dateReconciled: attr(),
  trackingNum: attr(),
  tags: DS.hasMany('tag'),
  lineItems: DS.hasMany('lineItem'),
  vendors: DS.hasMany('vendor'),
  attachments: DS.hasMany('attachment'),
  receivings: DS.hasMany('receiving'),
  buyer: attr(),
  requester: attr(),
  recipient: attr()

});

App.PurchaseAdapter = DS.RESTAdapter.extend();
