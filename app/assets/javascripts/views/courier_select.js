
App.CourierSelect = Ember.Select.extend({
  viewName: 'select',

  contentBinding: 'couriers',
  valueBinding: 'courierCurrent',
  prompt: ' ',

  courierCurrent: function() {
    return this.get('controller.model.courier');
  }.property('controller.courier'),


  couriers: function() {
    return ['Airborne', 'CalTrac', 'DHL', 'FedEx', 'GSO', 'OnTrac', 'UPS', 'USPS'];
  }.property()
});
