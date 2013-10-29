var attr = DS.attr;

App.Note = DS.Model.extend({
  note: attr(),
  purchases: DS.hasMany('purchase'),
  created_at: attr(),
  updated_at: attr(),
  last_user: attr()
});

App.NoteAdapter = DS.RESTAdapter.extend();
