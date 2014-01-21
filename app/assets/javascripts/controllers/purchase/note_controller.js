
App.NoteController = Ember.ObjectController.extend({

  actions: {

    noteIsEntering: function() {
      var model = this.get('model');

      model.set('updated_at', moment().format(App.Globals.DATE_STRING));

      if (Ember.isEmpty(model.get('created_at')))
        model.set('created_at', moment().format(App.Globals.DATE_STRING));
    }
  }
});
