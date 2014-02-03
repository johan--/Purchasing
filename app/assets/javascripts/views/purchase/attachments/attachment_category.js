
App.AttachmentCategoryView = Ember.View.extend(App.AttachmentDroppableMixin, {
  tagName: 'li',
  classNames: ['category'],
  classNameBindings: ['active', 'isDragging'],

  template: Ember.Handlebars.compile('<a>{{view.category}} {{view.currentTabCount}}</a>'),


  currentTabCount: function() {
    var content = this.get('controller.store').all('attachment'),
        category = this.get('category');

    if (category == 'Other')
      category = null;

    var count = content.filter(function(item) {
      if (item.get('category') == category && !isEmpty(item._data.purchase))
        return true;
    }).length;

    if (count > 0)
      return '(' + count + ')';

  }.property('controller.refreshViewsCounter'),


  active: function() {
    var selected = this.get('selectedTab'),
        current = this.get('category');

    this.setDisabled();

    return current === selected;
  }.property('selectedTab'),


  click: function() {
    this.get('parentView').send('setCategoryTab', this.get('category'));
  },


  afterInsert: function() {
    this.set('enabled', true);
    this.setDisabled();
  },


  // Determines whether or not this category can be dropped on
  setDisabled: function() {
    var selected = this.get('selectedTab'),
        current = this.get('category');

    if (!this.get('enabled'))
      return;

    if (selected === current)
      this.$().droppable( 'option', 'disabled', true);
    else
      this.$().droppable( 'option', 'disabled', false);
  }
});
