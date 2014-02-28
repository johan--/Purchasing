
App.SearchAreaView = Ember.TextArea.extend({

  classNames: ['name_item', 'form-control'],
  action: 'startAdvancedSearch',

  didInsertElement: function() {
    var name = this.get('name'),
        controller = this.get('parentView.controller');

    this.set('value', controller[name]);
  },


  // Only plain inputs need to have a targetObject
  targetObject: function() {
    if (!isEmpty(this.get('value')))
      return this.get('parentView');
  }.property('value', 'parentView')

});
