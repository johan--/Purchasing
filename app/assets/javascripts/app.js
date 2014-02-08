
App = Ember.Application.create({
  LOG_TRANSITIONS: true,
  LOG_ACTIVE_GENERATION: true,
  //LOG_TRANSITIONS_INTERNAL: true  // Detailed transition logging
});


Ember.RSVP.configure('onerror', function(error) {
  Ember.Logger.assert(false, error);
});


// This is a fix for the 'You must use Ember.set() to access this property' errors
// Several metadata properties are being stored as objects
Ember.merge = function(original, updates) {
  for (var prop in updates) {
    if (!updates.hasOwnProperty(prop)) { continue; }

    Ember.set(original, prop, updates[prop]);
  }
  return original;
};


// In test mode we don't have time for a fadeOut
Ember.removeDom = function(el) {
  $('.tooltip').remove();

  if (Ember.testing)
    el.remove();
  else
    el.fadeOut();
};

Ember.tryGet = function(obj, test) {
  if (!isEmpty(obj))
    return obj[test];
};


// Add tooltip removal to views
Ember.View.reopen({
  willDestroyElement: function() {
    // Attempt to remove tooltips
    if (this.$() && this.$().tooltip)
      this.$().tooltip('destroy');

    // Attempt to unbind anything remaining
    if (this.$())
      this.$().unbind();

    // Remove any hanging tooltips (this will happen with bootstrap elements)
    $('.tooltip').remove();
  }
});


// Add authorization rules to model
DS.Model.reopen({
  can_update: DS.attr('boolean', { defaultValue: true }),
  can_create: DS.attr('boolean', { defaultValue: true }),
  can_delete: DS.attr('boolean', { defaultValue: true })
});


// Current User Object
App.current_user = Ember.Object.create({

});

App.current_user.reopen({

  first_name: function() {
    var name = this.get('name');

    if (name) {
      var name_arr = name.split(' ');
      return name_arr[0];
    }
  }.property('name'),


  is_buyer: function() {
    var roles = this.get('roles'),
        admin = this.get('is_manager') || this.get('is_admin');

    if (roles || admin)
      return (roles.indexOf('buyer') > -1) || admin;
  }.property('roles', 'is_manager', 'is_admin'),


  is_receiver: function() {
    var roles = this.get('roles'),
        admin = this.get('is_manager') || this.get('is_admin');

    if (roles || admin)
      return (roles.indexOf('receiver') > -1) || admin;
  }.property('roles', 'is_manager', 'is_admin'),


  is_buyer_or_receiver: function() {
    return this.get('is_buyer') || this.get('is_receiver');
  }.property('is_buyer', 'is_receiver'),


  is_manager: function() {
    var roles = this.get('roles'),
        admin = this.get('is_admin');

    if (roles || admin)
      return (roles.indexOf('manager') > -1) || admin;
  }.property('roles', 'is_admin'),


  is_admin: function() {
    var roles = this.get('roles');

    if (roles)
      return (roles.indexOf('admin') > -1) || (roles.indexOf('developer') > -1);
  }.property('roles'),
});


App.ReceivingGlobals = Ember.Object.create({
  currentReceivingDoc: null,
  currentReceivingHoverDoc: null,

  resetObject: function() {
    this.set('currentReceivingDoc', null);
    this.set('currentReceivingHoverDoc', null);
  }
});
