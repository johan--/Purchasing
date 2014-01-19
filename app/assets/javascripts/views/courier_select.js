
App.CourierSelect = Ember.Select.extend({
  viewName: 'select',

  contentBinding: 'couriers',
  prompt: ' ',


  couriers: function() {
    return ['Airborne', 'CalTrac', 'DHL', 'FedEx', 'GSO', 'OnTrac', 'UPS', 'USPS'];
  }.property()
});
