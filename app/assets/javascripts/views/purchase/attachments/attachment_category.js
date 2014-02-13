
App.AttachmentCategoryView = Ember.View.extend(App.AttachmentFileDroppableMixin, {
  tagName: 'li',
  classNames: ['category'],
  classNameBindings: ['active', 'isDragging'],

  template: Ember.Handlebars.compile('<a>{{view.category}} {{view.currentCategoryCount}}</a>'),

  currentCategoryCount: function() {
    var content = this.get('controller.content'),
        currentCategory = this.get('category');

    var count = content.filter(function(item) {
      var category = item.get('category');

      if (isEmpty(item.get('purchase_id_server')))
        return false;

      if (currentCategory == 'Other')
        return isEmpty(category) || category === 'Other';

      return currentCategory === category;
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
