
App.QuickSearchFieldView = Ember.TextField.extend({
  oldVal: null,
  placeholder: 'Search',
  classNames: ['form-control', 'search_box_input'],

  action: 'startQuickSearch'
});
