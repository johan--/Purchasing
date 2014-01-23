
App.LineItemEditView = Ember.View.extend(App.DeleteableViewMixin, {
  templateName: 'purchase/line_item_edit',
  tagName: 'tr',

  classNames: ['line_item'],
  classNameBindings: ['controller.highlightedClassName'],

  didInsertElement: function(el) {
    this.get('controller').send('numberLines');
  },


  thisWasDeleted: function() {
    var deleted = !!this.get('controller.model.isDestroy');

    if (this.$())
      this.$().find('input').attr('disabled', deleted);

  }.observes('controller.model.isDestroy'),


  missingDescription: function() {
    var quantity = isEmpty(this.get('controller.quantity')),
        description = isEmpty(this.get('controller.description'));

    return description && !quantity;
  }.property('controller.quantity', 'controller.description'),


  missingQuantity: function() {
    var quantity = isEmpty(this.get('controller.quantity')),
        description = isEmpty(this.get('controller.description'));

    return !description && quantity;
  }.property('controller.quantity', 'controller.description')
});
