
var attr = DS.attr;

App.Account = DS.Model.extend({

  number: attr(),
  isDestroy: attr(),
  user_id: attr(),
  number_purchases: attr(), // Server count

  user: DS.belongsTo('user'),
  purchases: DS.hasMany('purchase')

});
