
App = Ember.Application.create({
  LOG_TRANSITIONS: true,
  LOG_ACTIVE_GENERATION: true,
  //LOG_TRANSITIONS_INTERNAL: true  // Detailed transition logging
});

Ember.RSVP.configure('onerror', function(error) {
  Ember.Logger.assert(false, error);
});
