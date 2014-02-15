
var attr = DS.attr;

App.Receiving = DS.Model.extend({

  package_num: attr(),
  package_date: attr(),
  total_price: attr(), // Server

  created_at: attr('string', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING_FULL); } }),
  updated_at: attr('string', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING_FULL); } }),
  last_user: attr('string', { defaultValue: function() { return App.current_user.get('username'); } }),

  purchase: DS.belongsTo('purchase'),
  receivingLines: DS.hasMany('receivingLine'),

  totalCount: function() {
    return this.get('receivingLines').reduce(function(sum, line){
      return sum + (line.get('quantity') || 0);
    }, 0);
  }.property('receivingLines.@each.quantity'),


  priceTotal: function() {
    return toCurrency(this.get('receivingLines').reduce(function(sum, line){
      return sum + line.get('lineItemTotal') || 0;
    }, 0));
  }.property('receivingLines.@each.lineItemTotal'),


  rollbackWithChildren: function() {
    var lines = this.get('receivingLines');
    lines.filterBy('isDirty', true).forEach(function(line){
      line.rollback();
    });

    if (this.get('isDirty'))
      this.rollback();
  },

  lineIds: function() {
    var ids = [];

    this.get('receivingLines').map(function(item){
      var id = item.get('lineItem.id');
      if (id)
        ids.push(id);
    });

    return ids;
  }

});

App.ReceivingSerializer = App.SerializeMyChildren.extend();
