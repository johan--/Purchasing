
// Input will add bootstrap error class if length does not match validatedLength
App.ValidatedInputView = Ember.TextField.extend({

  validatedLength: 6,

  didInsertElement: function() {
    this.validate();
  },


  valueObserver: function() {
    this.validate();
  }.observes('value'),


  validate: function() {
    var length = this.$().val().length,
        validatedLength = this.get('validatedLength');

    if (length !== validatedLength)
      this.$().parent().addClass('has-error');
    else
      this.$().parent().removeClass('has-error');
  }
});
