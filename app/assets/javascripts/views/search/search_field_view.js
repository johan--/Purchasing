
App.SearchFieldView = Ember.TextField.extend({
  oldVal: null,
  placeholder: 'Search',
  classNames: ['form-control', 'search_box_input'],

  action: 'startSearch'

});
