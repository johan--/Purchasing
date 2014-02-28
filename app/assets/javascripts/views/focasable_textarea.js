
App.FocasableTextArea = Ember.TextArea.extend({

  didInsertElement: function() {
    this.$().focus();
  }
});
