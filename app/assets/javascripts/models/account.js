
var attr = DS.attr;

App.Account = DS.Model.extend({

  number: attr(),
  user_id: attr(),
  number_purchases: attr(), // Server count

  isDestroy: attr(),

  user: DS.belongsTo('user'),
  purchases: DS.hasMany('purchase')

});
