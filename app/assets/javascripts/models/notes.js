var attr = DS.attr;

App.Note = DS.Model.extend({
  text: attr(),
  created_at: attr(),
  updated_at: attr(),
  last_user: attr(),
  destroy: attr(),

  purchases: DS.hasMany('purchase')
});

App.NoteAdapter = DS.RESTAdapter.extend();
