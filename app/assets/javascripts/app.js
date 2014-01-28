
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
    $('.tooltip').remove();
  }
});


// Add authorization rules to model
DS.Model.reopen({
  can_update: DS.attr(),
  can_create: DS.attr(),
  can_delete: DS.attr()
})
