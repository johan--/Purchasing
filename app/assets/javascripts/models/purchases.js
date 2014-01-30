
var attr = DS.attr;

App.Purchase = DS.Model.extend({

  starred: attr(),
  dateRequested: attr(),
  dateApproved: attr(),
  dateRequired: attr(),
  dateExpected: attr(),
  datePurchased: attr(),
  datePosted: attr(),
  dateReconciled: attr(),
  dateCancelled: attr(),
  tax_rate: attr(),
  shipping: attr(),
  labor: attr(),
  buyer: attr(),
  requester: attr(),
  recipient: attr(),
  trackingNum: attr(),
  order_number: attr(),
  order_confirmation: attr(),
  courier: attr(),
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
    return this.get('attachments.length') || 0;
  }.property('attachments.length'),


  vendorString: function() {
    var vendors = this.get('vendors');
    if (vendors)
      return this.get('vendors').map(function(v){ return v._data.name; }).join(', ');
  }.property('vendors'),


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
