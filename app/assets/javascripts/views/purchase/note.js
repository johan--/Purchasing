
App.NoteView = Ember.View.extend({
  templateName: 'purchase/note',

  actions: {
    deleteMe: function() {
      this.get('controller').send('deleteRecord', this.$());
    }
  }
})
