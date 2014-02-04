
var attr = DS.attr;

App.Note = DS.Model.extend(App.MakeParentDirty, {

  parentObject: 'purchase',

  text: attr(),

  created_at: attr(),
  updated_at: attr(),
  last_user: attr(),
  isDestroy: attr(),

  purchase: DS.belongsTo('purchase')
});
