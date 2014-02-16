
App.NoteNewView = Ember.View.extend({
  templateName: 'purchase/notes/new_view',


  willDestroyElement: function() {
    this.$('.modal').modal('hide');
    this.$('.modal').unbind();
    this._super();
  },


  actions: {

    newAccountSave: function() {
      this.get('parentView').send('newAccountSave');
    }
  }
});
