var attr = DS.attr;

App.Note = DS.Model.extend({
  note: attr(),
  purchases: DS.hasMany('purchase')
});

App.NoteAdapter = DS.RESTAdapter.extend();
