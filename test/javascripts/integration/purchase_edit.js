
module('Purchase Edit', {
  setup: function() {
    App.reset();
    Ember.run(App, App.advanceReadiness);

    // Build metadata
    metadata = getMetadata('purchase');
  },

  teardown: function() {
    ajax_params = null;
  }
});
