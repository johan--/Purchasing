
var attr = DS.attr;

App.ReceivingLine = DS.Model.extend(App.MakeParentDirty, {

  parentObject: 'receiving',

  quantity: attr(),

  created_at: attr('string', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING_FULL); } }),
  updated_at: attr('string', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING_FULL); } }),
  last_user: attr('string', { defaultValue: function() { return App.current_user.get('username'); } }),
  isDestroy: attr(),

  receiving: DS.belongsTo('receiving'),
  lineItem: DS.belongsTo('lineItem'),

  lineItemTotal: function() {
    var lineCost = toNumber(this.get('lineItem.price')),
        quantity = this.get('quantity');

    return lineCost * quantity;
  }.property('lineItem.price', 'quantity'),


  observeField: function() {
    return this.get('quantity');
  }.property('quantity')

});
