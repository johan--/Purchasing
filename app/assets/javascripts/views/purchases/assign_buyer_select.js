
App.AssignBuyerSelect = Ember.Select.extend({
  viewName: 'select',
  classNames: ['form-control'],

  optionValuePath: 'content.id',
  optionLabelPath: 'content.name',
  contentBinding: 'buyersList',
  valueBinding: 'buyerCurrent',


  buyersList: function() {
    return this.get('controller.metadata.buyers');
  }.property('controller.metadata.buyers'),


  buyerCurrent: function() {
    return App.current_user.get('id');
  }.property('App.current_user.id'),


  change: function(evt) {
    var id = (this.selection) ? this.selection.id : 'all';
    this.get('controller').set('assignBuyer', id);
  }
});
