
App.SearchFieldView = Ember.TextField.extend({
  oldVal: null,
  placeholder: 'Search',
  classNames: ['form-control', 'search_box_input'],

  action: 'startSearch',

  // Don't bind queryParams directly to input, otherwise route will refresh on every character typed
  didInsertElement: function() {
    var val = this.get('parentView.value');
    this.$().val(val);
  }

});
