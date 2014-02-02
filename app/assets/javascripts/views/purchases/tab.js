
App.PurchaseTabView = Ember.View.extend({
  templateName: 'purchases/tab',
  classNameBindings: ['tabIsSelected:active'],
  tagName: 'li',

  tabIsSelected: function() {
    return this.get('value') === this.get('controller.tab');
  }.property('controller.tab'),


  click: function() {
    var controller = this.get('controller'),
        value = this.get('value');
    controller.transitionToRoute('purchases.tabs', { queryParams:  {tab: value, purPage: 1 } });
  }
});
