
App.ErrorRoute = Ember.Route.extend({

  renderTemplate: function() {
    console.log(this.currentModel);
    this.render();
  }
});
