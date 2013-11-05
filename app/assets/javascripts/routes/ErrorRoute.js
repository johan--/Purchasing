App.ErrorRoute = Ember.Route.extend({
  renderTemplate: function() {
    console.log(this.get('model'));
    this.controllerFor('application').send('notify', { message: message, type: 'error' });
  }

})
