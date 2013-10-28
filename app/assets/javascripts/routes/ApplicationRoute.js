App.ApplicationRoute = Ember.Route.extend({

  actions: {
    openModal: function(controller, view, model){
      this.controllerFor(controller).set('model', model);
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
    }
  }
})
