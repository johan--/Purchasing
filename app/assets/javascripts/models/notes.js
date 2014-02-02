
var attr = DS.attr;

App.Note = DS.Model.extend(App.MakeParentDirty, {

  parentObject: 'purchase',

  text: attr(),

  created_at: attr('date', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING); } }),
  updated_at: attr('date', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING); } }),
  last_user: attr('string', { defaultValue: function() { return App.current_user.get('name'); } }),
  isDestroy: attr(),

  purchase: DS.belongsTo('purchase')
});
