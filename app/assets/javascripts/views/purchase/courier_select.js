
App.CourierSelect = Ember.Select.extend({
  viewName: 'select',

  classNames: ['form-control', 'courier_select'],
  contentBinding: 'couriers',
  prompt: ' ',


  couriers: function() {
    return App.Globals.couriers;
  }.property()

});
