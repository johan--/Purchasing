
App.ApplicationRoute = Ember.Route.extend({

  buildModal: function(model, controller, view, element) {
    this.controllerFor(controller).set('model', model);
    this.controllerFor(controller).set('domElement', element);  // Pass dom element if supplied

    return this.render(view, {
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
          return self.buildModal(model, controller, view, element);
        });

      } else {
        return self.buildModal(model, controller, view, element);
      }
    },


    closeModal: function() {
      $('.modal-backdrop').remove();
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView:'application'
      });
    },


    openTags: function() {
      var tags = this.store.find('tag');
      this.send('openModal', 'TagsAdmin', 'tags/index', tags);
    },


    openCannedMessages: function() {
      this.store.unloadAll('cannedMessage');
      var messages = this.store.find('cannedMessage');
      this.send('openModal', 'CannedMessagesAdmin', 'canned_messages/index', messages);
    }
  }
});
