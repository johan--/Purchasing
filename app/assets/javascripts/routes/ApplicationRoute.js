App.ApplicationRoute = Ember.Route.extend({

  actions: {
    openModal: function(controller, view, model, element){
      this.controllerFor(controller).set('model', model);
      this.controllerFor(controller).set('domElement', element);  // Pass dom element if supplied
      console.log('Opening record ' + ((model.id) ? model.id : 'new') + ' into ' + view);

      return this.render(view, {
        into:'application',
        outlet: 'modal',
        controller: controller
      });
    },

    closeModal: function() {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView:'application'
      })
    },
  }
})
  /*
    error: function(error, transition) {
      if (Ember.isEmpty(error))
        return;
      this.controllerFor('application').clearNotifications();
      this.controllerFor('application').notify({ message: error.responseText, type: 'error'});
    }
  },*/
