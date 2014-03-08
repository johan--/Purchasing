
App.NoteInputView = Ember.TextField.extend({

  focusOut: function() {
    this.get('targetObject').send('checkForLastLine', this.get('targetObject.id'));
  },


  changed: function() {
    this.get('targetObject').send('noteIsEntering');
  }.observes('value')
});
