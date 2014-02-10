
App.AttachmentsRoute = Ember.Route.extend({

  beforeModel: function(transition, queryParams)  {
    // Abort transition if we are not permitted to edit
    if (App.current_user.get('is_buyer') !== true) {
      transition.abort();
      this.transitionTo('purchases.tabs');
    }
  },


  model: function(params, transition, queryParams) {
    return this.store.find('attachment', params);
  },

  setupController: function(controller, model) {
    // Instead of the server results, return all attachments (so the controller observes everything)
    var allModel = this.store.all('attachment');
    controller.set('model', allModel);
  },


  renderTemplate: function() {
    $('.main_spinner').hide();
    this.render('attachments/index');
  }

});
