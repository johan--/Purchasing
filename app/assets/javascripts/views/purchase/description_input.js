App.DescriptionInputView = Ember.TextField.extend({
  focusOut: function() {
    this.get('targetObject').send('checkForLastLine', this.get('targetObject.id'));
  }
})
