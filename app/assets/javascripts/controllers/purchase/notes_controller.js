
App.NotesController = Ember.ArrayController.extend({
  itemController: 'note',

  sortProperties: ['id'],
  sortAscending: false,

  filteredContent: function() {
    return this.rejectBy('isDeleted');
  }.property('@each.isDeleted', '@each.isDirty'),


  actions: {
    createNote: function() {
      var newNote = this.store.createRecord('note');

      newNote.set('updated_at', moment().format(App.Globals.DATE_STRING_FULL));
      newNote.set('created_at', moment().format(App.Globals.DATE_STRING_FULL));
      newNote.set('last_user', App.Session.currentUser.get('name'));
      newNote.set('purchase', this.get('parentController.model'));

      this.send('openModal', 'Note', 'purchase/notes/form', newNote);
      return false;
    }
  }
});
