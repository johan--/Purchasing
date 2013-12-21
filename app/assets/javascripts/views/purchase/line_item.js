
App.LineItemView = Ember.View.extend(App.DeleteableViewMixin, {
  templateName: 'purchase/line_item',
  tagName: 'tr',

  classNames: ['line_item'],
  classNameBindings: ['controller.highlightedClassName'],


  didInsertElement: function() {
    this.get('controller').send('numberLines');
  }
});
