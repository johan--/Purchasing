
App.ValidatedInputView = Ember.TextField.extend({

  validatedLength: 6,

  didInsertElement: function() {
    this.validate();
  },


  keyUp: function() {
    this.validate();
  },

  validate: function() {
    var length = this.$().val().length,
        validatedLength = this.get('validatedLength');

    if (length !== validatedLength)
      this.$().parent().addClass('has-error');
    else
      this.$().parent().removeClass('has-error');
  }
});