
App.EditFocasableInput = Ember.TextField.extend({

  didInsertElement: function() {
    this.$().focus();
  }
});
