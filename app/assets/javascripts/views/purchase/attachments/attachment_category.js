
App.AttachmentCategoryView = Ember.View.extend(App.AttachmentFileDroppableMixin, {
  tagName: 'li',
  classNames: ['category'],
  classNameBindings: ['active', 'isDragging'],

  template: Ember.Handlebars.compile('<a>{{view.category}} {{view.currentCategoryCount}}</a>'),

  currentCategoryCount: function() {
    var content = this.get('controller.store').all('attachment'),
        category = this.get('category');

    if (category == 'Other')
      category = null;

    var count = content.filter(function(item) {
      if (item.get('category') == category && !isEmpty(item.get('purchase_id_server')))
        return true;
    }).length;

    if (count > 0)
      return '(' + count + ')';

  }.property('controller.@each.category'),


  active: function() {
    var selected = this.get('selectedCategory'),
        current = this.get('category');

    return current === selected;
  }.property('selectedCategory'),


  click: function() {
    this.set('selectedCategory', this.get('category'));
  }

});
