
App.LineItemView = Ember.View.extend(App.DeleteableViewMixin, {
  templateName: 'purchase/line_item',

  classNames: ['line_item'],
  classNameBindings: ['controller.isHighlighted'],

  didInsertElement: function() {
    this.get('controller').send('numberLines');
  },

})
