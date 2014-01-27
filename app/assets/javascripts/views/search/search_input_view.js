
App.SearchInputView = Ember.TextField.extend({

  classNames: ['name_item', 'form-control'],
  action: 'startAdvancedSearch',


  didInsertElement: function() {
    var id = this.$().attr('id'),
        queryParams = this.get('parentView.controller');

    if (queryParams[id])
      this.set('value', queryParams[id]);
  },


  targetObject: function() {
    if (!isEmpty(this.get('value')))
      return this.get('parentView');
  }.property('value', 'parentView')

});
