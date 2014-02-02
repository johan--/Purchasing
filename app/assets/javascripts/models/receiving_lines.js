
var attr = DS.attr;

App.ReceivingLine = DS.Model.extend(App.MakeParentDirty, {

  parentObject: 'receiving',

  quantity: attr(),

  created_at: attr('date', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING); } }),
  updated_at: attr('date', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING); } }),
  last_user: attr('string', { defaultValue: function() { return App.current_user.get('name'); } }),
  isDestroy: attr(),

  receiving: DS.belongsTo('receiving'),
  lineItem: DS.belongsTo('lineItem'),

  lineItemTotal: function() {
    var lineCost = toNumber(this.get('lineItem.price')),
        quantity = this.get('quantity');

    return lineCost * quantity;
  }.property('lineItem.price', 'quantity')

});
