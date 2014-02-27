
App.FancyControlsView = Ember.View.extend({

  templateName: 'views/fancy_controls',

  actions: {

    rotateLeft: function() {
      App.FancyBox.rotateImage(-90);
    },


    rotateRight: function() {
      App.FancyBox.rotateImage(90);
    }

  }
});
