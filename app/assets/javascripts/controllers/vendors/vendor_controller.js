App.VendorController = Ember.ObjectController.extend({

  isEditing: false,

  hasEmail: function() {
    var email = this.get('email');
    return !Ember.isEmpty(email);
  }.property('email'),


  hasWebsite: function() {
    var website = this.get('website');
    return !Ember.isEmpty(website);
  }.property('website'),


  city_state: function() {
    var city = this.get('city'),
        state = this.get('state') || '';
    return (city) ? city + ', ' + state : state;
  }.property('city', 'state'),

  actions: {

    openRecord: function(element) {
      var record = this.get('model');
      this.send('openModal', 'VendorEdit', 'vendors/form', record, element);
      return false;
    }
  }
});
