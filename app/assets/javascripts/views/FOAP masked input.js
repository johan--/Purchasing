
App.FOAPMasketInput = Ember.TextField.extend({


  didInsertElement: function() {
    this.$().focus();
    this.$().mask('999999-999999-99999');
  },


  focusOut: function() {
    //this.get('targetObject').send('stopEditing');
  }
});
