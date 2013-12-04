
App = Ember.Application.create({
  LOG_TRANSITIONS: true,
  LOG_ACTIVE_GENERATION: true,
});

Ember.FEATURES["query-params"] = true

Ember.RSVP.configure('onerror', function(e) {
  console.log(e.message);
  console.log(e.stack);
});

Ember.merge = function(original, updates) {
  for (var prop in updates) {
    if (!updates.hasOwnProperty(prop)) { continue; }

    // This is a fix for the 'You must use Ember.set() to access this property' errors
    // Several metadata properties are being stored as objects
    Ember.set(original, prop, updates[prop]);

  }
  return original;
};
