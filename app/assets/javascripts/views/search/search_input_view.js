
App.SearchInputView = Ember.TextField.extend({

  classNames: ['name_item', 'form-control'],
  action: 'startAdvancedSearch',


  didInsertElement: function() {
    var id = this.$().attr('id'),
        target = this.get('parentView.controller');

    if (isEmpty(id))
      return;

    target.addObserver(id, this, this.updateValue);
  },


  willDestroyElement: function() {
    var id = this.$().attr('id'),
        target = this.get('parentView.controller');

    if (isEmpty(id))
      return;

    target.removeObserver(id, this, this.updateValue);
  },


  updateValue: function() {
    var id = this.$().attr('id'),
        target = this.get('parentView.controller');

    this.set('value', target[id]);
  },


  targetObject: function() {
    if (!isEmpty(this.get('value')))
      return this.get('parentView');
  }.property('value', 'parentView')

});
