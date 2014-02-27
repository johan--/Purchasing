
App.PurchaseTabView = Ember.View.extend({
  templateName: 'purchases/tab',
  classNameBindings: ['tabIsSelected:active'],
  tagName: 'li',

  tabIsSelected: function() {
    var isSearchResults = this.get('controller.isSearchResults'),
        value = this.get('controller.tab');

    if (!isSearchResults)
      return this.get('value') === this.get('controller.tab');
  }.property('controller.tab'),


  click: function() {
    var controller = this.get('controller'),
        value = this.get('value');

    controller.send('tabClick', value);
  }
});
