
App.FilterView = Ember.View.extend({
  templateName: 'purchases/filter_view',
  tagName: 'span',
  classNames: ['button', 'grey'],

  click: function() {
    $('.advanced_filter_box').show();
  }
})
