
App.SearchSelectView = Ember.Select.extend({

  didInsertElement: function() {
    var id = this.$().attr('id'),
        value = this.get('controller').get(id);
    if (value)
      this.set('value', value);
  },

});