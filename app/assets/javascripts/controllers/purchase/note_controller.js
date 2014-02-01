
App.NoteController = Ember.ObjectController.extend({

  actions: {

    noteIsEntering: function() {
      var model = this.get('model');

      model.set('updated_at', moment().format(App.Globals.DATE_STRING));
      model.set('last_user', App.current_user.username);

      if (isEmpty(model.get('created_at')))
        model.set('created_at', moment().format(App.Globals.DATE_STRING));

      this.get('parentController.parentController.model').send('becomeDirty');
    }
  }
});
