
mockResults = {
  ajaxParams: null,
  alertMessage: null,

  clearMockResults: function() {
    this.ajaxParams = null;
    this.alertMessage = null;
  }
};


// Setup mock for ajax
$.ajax = function(params) {
  console.log('Ajax called with: ');
  console.log(params);
  mockResults.ajaxParams = params;

  // Build response
  var deferred = $.Deferred();
  // Resolve immediately so there aren't any async problems
  // TODO: This causes a 10 second delay??

  return deferred.resolve();
};


// Setup mock for alert()
window.alert = function(msg) {
  mockResults.alertMessage = msg;
}

// Setup mock for confirm()
window.confirm = function(msg) {
  mockResults.alertMessage = msg;
  return true;
}
