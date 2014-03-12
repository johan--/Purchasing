
App.LineItemEditView = Ember.View.extend(App.DeleteableViewMixin, {
  templateName: 'purchase/line_items/item_edit',
  tagName: 'tr',

  classNames: ['line_item'],
  classNameBindings: ['controller.highlightedClassName'],

  disabled: Ember.computed('controller.model.isDestroy',
              function() { return !!this.get('controller.model.isDestroy'); }),

  didInsertElement: function(el) {
    this.get('controller').send('numberLines');
  },


  missingDescription: function() {
    console.log(1)
    var quantity = isEmpty(this.get('controller.quantity')),
        description = isEmpty(this.get('controller.description'));

    console.log(description)
    console.log(quantity)
    console.log(description && !quantity)
    return description && !quantity;
  }.property('controller.quantity', 'controller.description'),


  missingQuantity: function() {
    console.log(2)
    var quantity = isEmpty(this.get('controller.quantity')),
        description = isEmpty(this.get('controller.description'));

    return !description && quantity;
  }.property('controller.quantity', 'controller.description')
});
