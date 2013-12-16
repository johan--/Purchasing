
App = Ember.Application.create({
  LOG_TRANSITIONS: true,
  LOG_ACTIVE_GENERATION: true,
  //LOG_TRANSITIONS_INTERNAL: true  // Detailed transition logging
});

Ember.FEATURES["query-params"] = true;

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
  if (Ember.testing)
    el.remove();
  else
    el.fadeOut();
};

Ember.tryGet = function(obj, test) {
  if (!Ember.isEmpty(obj))
    return obj.test;
};
