
var attr = DS.attr;

App.Note = DS.Model.extend(App.MakeParentDirty, {

  parentObject: 'purchase',

  text: attr(),

  created_at: attr('string', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING_FULL); } }),
  updated_at: attr('string', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING_FULL); } }),
  last_user: attr('string', { defaultValue: function() { return App.current_user.get('username'); } }),
  isDestroy: attr(),

  purchase: DS.belongsTo('purchase')
});
