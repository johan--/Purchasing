
App.NoteView = Ember.View.extend(App.DeleteableViewMixin, {
  templateName: 'purchase/note',
  tagName: 'tr',

  classNames: ['note']
});
