
App.rootElement = '#ember-app-root';
App.setupForTesting();

ajax_params = null;

// Setup mock for ajax
$.ajax = function(params) {
  console.log('Ajax called with: ');
  console.log(params);
  ajax_params = params;

  // Build response
  var deferred = $.Deferred();
  // Resolve immediately so there aren't any async problems
  // TODO: This causes a 10 second delay??

  return deferred.resolve();
};
