App.FilterView = Ember.View.extend({
  templateName: 'purchases/filter_view',
  tagName: 'span',
  classNames: ['button', 'blue'],

  click: function() {
    $('.advanced_filter_box').show();
  }
})
