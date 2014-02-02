
App.ErrorRoute = Ember.Route.extend({

  renderTemplate: function() {
    var status = this.currentModel.status;

    // We are logged out
    if (status === 401) {
      location.reload();
      return;
    }

    console.log(this.currentModel);
    this.render();
  }
});
