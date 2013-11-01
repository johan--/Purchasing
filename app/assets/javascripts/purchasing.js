
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
    // The buyers / tags metadata was being converted into an object once it is initially set
    // TODO: Is there a better way to detect object?
    if ((prop == 'buyers' || prop == 'tags') && !Ember.isEmpty(original[prop])) {
      Ember.set(original, prop, updates[prop]);
    } else {
      original[prop] = updates[prop];
    }
  }
  return original;
};
