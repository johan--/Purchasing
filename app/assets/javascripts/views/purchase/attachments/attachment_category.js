
App.AttachmentCategoryView = Ember.View.extend(App.AttachmentDroppableMixin, {
  tagName: 'li',
  classNames: ['category'],
  classNameBindings: ['active', 'isDragging'],

  template: Ember.Handlebars.compile('<a>{{view.category}}</a>'),


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
