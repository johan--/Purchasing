var attr = DS.attr;

App.Purchase = DS.Model.extend(App.ModelNotificationMixin, {

  starred: attr(),
  dateRequested: attr(),
  dateApproved: attr(),
  datePurchased: attr(),
  dateExpected: attr(),
  dateRequired: attr(),
  dateReceived: attr(),
  dateReconciled: attr(),
  tax_rate: attr(),
  shipping: attr(),
  labor: attr(),
  buyer: attr(),
  requester: attr(),
  recipient: attr(),
  trackingNum: attr(),

  attachments: DS.hasMany('attachment'),
  lineItems: DS.hasMany('lineItem'),
  receivings: DS.hasMany('receiving'),
  tags: DS.hasMany('tag'),
  vendors: DS.hasMany('vendor'),
});

App.PurchaseAdapter = DS.RESTAdapter.extend();
