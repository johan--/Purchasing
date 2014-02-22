
var attr = DS.attr;

App.ReceivingLine = DS.Model.extend(App.MakeParentDirty, {

  // Field to observe for makeParentDirty
  observeField: Ember.computed.alias('quantity'),
  parentObject: 'receiving',

  quantity: attr(),

  created_at: attr('string', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING_FULL); } }),
  updated_at: attr('string', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING_FULL); } }),
  last_user: attr('string', { defaultValue: function() { return App.current_user.get('username'); } }),
  isDestroy: attr(),

  receiving: DS.belongsTo('receiving'),
  lineItem: DS.belongsTo('lineItem'),

  lineItemTotal: function() {
    var lineCost = toNumber(this.get('lineItem.price')) || 0,
        quantity = toNumber(this.get('quantity')) || 0;

    return lineCost * quantity;
  }.property('lineItem.price', 'quantity')

});
