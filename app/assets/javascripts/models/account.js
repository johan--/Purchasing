
var attr = DS.attr;

App.Account = DS.Model.extend({

  number: attr(),
  user_id: attr(),
  number_purchases: attr(), // Server count

  isDestroy: attr(),

  //user: DS.belongsTo('user'), // Don't... this will cause store.unloadAll('accounts') to fire GET users/:id
  purchases: DS.hasMany('purchase')

});
