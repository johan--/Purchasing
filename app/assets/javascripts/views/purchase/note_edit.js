
App.NoteEditView = Ember.View.extend(App.DeleteableViewMixin, {
  tagName: 'tr',
  templateName: 'purchase/note_edit',

  classNames: ['note']
});
