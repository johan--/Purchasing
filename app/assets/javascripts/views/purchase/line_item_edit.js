
App.LineItemEditView = Ember.View.extend(App.DeleteableViewMixin, {
  templateName: 'purchase/line_item_edit',
  tagName: 'tr',

  classNames: ['line_item'],
  classNameBindings: ['controller.highlightedClassName'],

  didInsertElement: function(el) {
    this.get('controller').send('numberLines');
  },

  thisWasDeleted: function() {
    var deleted = this.get('controller.model.isDestroy');
    var el = $();

    if (this.$())
      el = this.$().find('input');

    if (deleted === true)
      el.attr('disabled', true);
    else
      el.attr('disabled', false);

  }.observes('controller.model.isDestroy')
});
