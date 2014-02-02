
var attr = DS.attr;

App.Purchase = DS.Model.extend({

  starred: attr(),
  dateRequested: attr('string', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING); } }),
  dateApproved: attr(),
  dateRequired: attr(),
  dateExpected: attr('string', { defaultValue: function() { return moment().add('day', 14).format(App.Globals.DATE_STRING); } }),
  datePurchased: attr(),
  datePosted: attr(),
  dateReconciled: attr(),
  dateCancelled: attr(),
  tax_rate: attr('string', { defaultValue: '%10.0' }),
  shipping: attr(),
  labor: attr(),
  buyer: attr(),
  requester: attr(),
  recipient: attr(),
  trackingNum: attr(),
  order_number: attr(),
  order_confirmation: attr(),
  courier: attr(),
  vendor_string: attr(),
  received_server: attr(),

  created_at: attr('string', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING_FULL_FULL); } }),
  updated_at: attr('string', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING_FULL_FULL); } }),
  last_user: attr('string', { defaultValue: function() { return App.current_user.get('username'); } }),

  attachments: DS.hasMany('attachment'),
  lineItems: DS.hasMany('lineItem'),
  receivings: DS.hasMany('receiving'),
  tags: DS.hasMany('tag'),
  purchaseToTags: DS.hasMany('purchaseToTag'),
  notes: DS.hasMany('note'),
  vendors: DS.hasMany('vendor'),

  account: DS.belongsTo('account'),

  subTotal: function() {
    return this.get('lineItems').reduce(function(sum, line){
      return sum + (line.get('extendedCostNumber') || 0);
    }, 0);
  }.property('lineItems.@each.extendedCostNumber'),


  tax: function() {
    var rate = toNumber(this.get('tax_rate') || 0),
        subTotal = toNumber(this.get('subTotal') || 0);
    return rate * subTotal;
  }.property('subTotal', 'tax_rate'),


  taxRateDisplay: function(){
    var rate = this.get('tax_rate');
    if (isEmpty(rate))
      rate = '%0.0';

    return rate;
  }.property('tax_rate'),


  grandTotal: function() {
    return toNumber(this.get('subTotal') || 0) +
           toNumber(this.get('tax') || 0) +
           toNumber(this.get('labor') || 0) +
           toNumber(this.get('shipping') || 0);
  }.property('subTotal', 'tax', 'shipping', 'labor'),


  attachmentCount: function() {
    var attachments = this.get('attachments');
    return attachments.filter(function(item){
      if (item._data.purchase)
        return true;
    }).get('length');
  }.property('attachments.length'),


  accountNumber: function() {
    var account = this.get('account.number');
    if (account)
      return account;
  }.property('account.number'),


  received: function() {
    // Setter
    if (arguments.length > 1)
      return;

    var lineItems = this.get('lineItems'),
        receivingsCount = this.get('receivings.length'),
        received = false;

    if (receivingsCount < 1)
      return false;

    var filteredLines = lineItems.filter(function(line){
      var quantity = line.get('quantity'),
          receivedCount = line.get('receivedCount');

      if ((quantity > receivedCount) && (quantity > 0))
        return true;
    });

    return filteredLines.get('length') === 0;
  }.property('lineItems.@each.quantity', 'lineItems.@each.receivedCount')

});

App.PurchaseSerializer = App.SerializeMyChildren.extend();
