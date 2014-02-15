
// When this view is inserted it takes focus
App.EditFocasableInput = Ember.TextField.extend({

  didInsertElement: function() {
    this.$().focus();
  }
});
