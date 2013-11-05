var attr = DS.attr;

App.Purchase = DS.Model.extend({

  starred: attr(),
  dateRequested: attr(),
  dateApproved: attr(),
  datePurchased: attr(),
  dateExpected: attr(),
  dateRequired: attr(),
  dateReconciled: attr(),
  received: attr(),
  tax_rate: attr(),
  shipping: attr(),
  labor: attr(),
  buyer: attr(),
  requester: attr(),
  recipient: attr(),
  trackingNum: attr(),
  titleText: attr(),

  attachments: DS.hasMany('attachment'),
  lineItems: DS.hasMany('lineItem'),
  receivings: DS.hasMany('receiving'),
  tags: DS.hasMany('tag'),
  purchaseToTags: DS.hasMany('purchaseToTag'),
  notes: DS.hasMany('note'),
  vendors: DS.hasMany('vendor')
});

App.PurchaseAdapter = DS.RESTAdapter.extend();
App.PurchaseSerializer = App.SerializeMyChildren.extend();
