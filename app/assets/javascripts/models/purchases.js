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
  updated_at: attr(),
  last_user: attr(),

  attachments: DS.hasMany('attachment'),
  lineItems: DS.hasMany('lineItem'),
  receivings: DS.hasMany('receiving'),
  tags: DS.hasMany('tag'),
  purchaseToTags: DS.hasMany('purchaseToTag'),
  notes: DS.hasMany('note'),
  vendors: DS.hasMany('vendor'),

  account: DS.belongsTo('account'),

  subTotal: function() {
    var total = 0,
        lineItems = this.get('lineItems');

    if (Ember.isEmpty(lineItems))
      return 0;

    lineItems.forEach(function(line){
      total += toNumber(line.get('extendedCost') || 0);
    });

    return total;
  }.property('lineItems.@each.extendedCost'),

  tax: function() {
    var rate = toNumber(this.get('tax_rate') || 0),
        subTotal = toNumber(this.get('subTotal') || 0);
    return rate * subTotal;
  }.property('subTotal', 'tax_rate'),

  grandTotal: function() {
    return toNumber(this.get('subTotal') || 0) +
           toNumber(this.get('tax') || 0) +
           toNumber(this.get('labor') || 0) +
           toNumber(this.get('shipping') || 0);
  }.property('subTotal', 'tax', 'shipping', 'labor'),


  attachmentCount: function() {
    var attachments = this.get('attachments');
    return (attachments) ? attachments.get('length') : 0;
  }.property('attachments'),

});

App.PurchaseAdapter = DS.RESTAdapter.extend();
App.PurchaseSerializer = App.SerializeMyChildren.extend();
