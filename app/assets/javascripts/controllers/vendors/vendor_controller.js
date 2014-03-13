
App.VendorController = Ember.ObjectController.extend({

  isEditing: false,

  hasEmail: Ember.computed.bool('email'),
  hasWebsite: Ember.computed.bool('website'),

  canNotDelete: Ember.computed.notEmpty('num_purchases'),

  city_state: function() {
    return [this.get('city'), this.get('state')].join(', ');
  }.property('city', 'state'),

  actions: {

    openRecord: function(element) {
      var record = this.get('model');
      this.send('openModal', 'VendorEdit', 'vendors/form', record, element);
      return false;
    }
  }
});
