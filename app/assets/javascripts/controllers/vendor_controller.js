App.VendorController = Ember.ObjectController.extend({

  hasEmail: function() {
    var email = this.get('email');
    return email != null && email != '';
  }.property('email'),

  hasWebsite: function() {
    var website = this.get('website');
    return website != null && website != '';
  }.property('website'),

  city_state: function() {
    var city = this.get('city'),
        state = this.get('state');
    return (city) ? city + ', ' + state : state;
  }.property('city', 'state')
})
