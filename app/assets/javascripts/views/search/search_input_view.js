
App.SearchInputView = Ember.TextField.extend({

  classNames: ['name_item', 'form-control'],
  action: 'startAdvancedSearch',


  didInsertElement: function() {
    var id = this.$().attr('id'),
        metadata = this.get('parentView.controller');

    if (metadata[id])
      this.set('value', metadata[id]);
  },


  targetObject: function() {
    if (!isEmpty(this.get('value')))
      return this.get('parentView');
  }.property('value', 'parentView')

});
