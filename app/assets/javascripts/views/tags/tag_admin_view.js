
App.TagAdminView = Ember.TextField.extend({

  didInsertElement: function() {
    this.$().focus();
  },

  focusOut: function() {
    //this.get('targetObject').send('stopEditing');
  }

});
