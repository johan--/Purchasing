App.ApplicationRoute = Ember.Route.extend({


  buildModal: function(context, model, controller, view, element) {
    var self = context;

    self.controllerFor(controller).set('model', model);
    self.controllerFor(controller).set('domElement', element);  // Pass dom element if supplied

    console.log('Opening record ' + ((model.id) ? model.id : 'new') + ' into ' + view);

    return self.render(view, {
      into: 'application',
      outlet: 'modal',
      controller: controller,
    });
  },


  actions: {

    openModal: function(controller, view, model, element){
      var self = this;

      // Should we wait for promise to resolve?
      if (Ember.canInvoke(model, 'then')) {
        return model.then(function(model){
          return self.buildModal(self, model, controller, view, element);
        });

      } else {
        return self.buildModal(self, model, controller, view, element);
      }
    },


    closeModal: function() {
      $('.ui-tooltip').remove();

      return this.disconnectOutlet({
        outlet: 'modal',
        parentView:'application'
      });
    },


    openTags: function() {
      var tags = this.get('store').find('tag');
      this.send('openModal', 'TagsAdmin', 'tags/index', tags);
    },


    // This isn't working the way I expect, and often will munch error messages
    error: function(error, transition) {
      if (Ember.isEmpty(error))
        return;
      this.controllerFor('application').clearNotifications();
      this.controllerFor('application').notify({ message: error.responseText, type: 'error'});
    },


    willTransition: function(transition) {
      // UI cleanup
      $('.ui-tooltip').remove();
      $('.ui-datepicker').remove();
      $('.token-input-dropdown').remove();
      $('.token-input-dropdown-large').remove();
    },

  }
});
