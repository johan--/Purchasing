
var attr = DS.attr;

App.Receiving = DS.Model.extend({

  package_num: attr(),
  package_date: attr(),
  total_price: attr(), // Server
  last_user: attr(),
  created_at: attr(),
  updated_at: attr(),
  isDestroy: attr(),

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
    this.rollback();

    this.get('receivingLines').forEach(function(line){
      if (isEmpty(line))
        line.deleteRecord();
      else
        line.rollback();
    });
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
