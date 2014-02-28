
App.FocasableInput = Ember.TextField.extend({

  didInsertElement: function() {
    this.$().focus();
  }
});
