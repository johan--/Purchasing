
App.SearchInputView = Ember.TextField.extend({

  classNames: ['name_item', 'form-control'],
  action: 'startAdvancedSearch',

  didInsertElement: function() {
    var name = this.get('name'),
        target = this.get('parentView.controller');
    this.set('value', target[name]);
  },


  // Only plain inputs need to have a targetObject
  targetObject: function() {
    if (!isEmpty(this.get('value')))
      return this.get('parentView');
  }.property('value', 'parentView')

});
