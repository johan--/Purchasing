
App = Ember.Application.create({
  LOG_TRANSITIONS: true,
  LOG_ACTIVE_GENERATION: true,
});

Ember.FEATURES["query-params"] = true

Ember.merge = function(original, updates) {
  for (var prop in updates) {
    if (!updates.hasOwnProperty(prop)) { continue; }

    // This is a fix for the 'You must use Ember.set() to access this property' errors
    // Several metadata properties are being stored as objects

    // TODO: Is there a better way to detect object?
    // TODO: Is it better just to call set on everything?
    if ((prop == 'buyers' || prop == 'tags' || prop == 'found_count') && !Ember.isEmpty(original[prop])) {
      Ember.set(original, prop, updates[prop]);
    } else {
      original[prop] = updates[prop];
    }
  }
  return original;
};
