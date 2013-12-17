
mockResults = {
  ajaxParams: null,
  alertMessage: null,
  url: null,
  params: null,

  clearMockResults: function() {
    this.ajaxParams = null;
    this.alertMessage = null;
    this.url = null;
    this.params = null;
  }
};


// Setup mock for ajax
$.ajax = function(params) {
  var self = this;

  console.log('Ajax called with: ');
  console.log(params);
  mockResults.ajaxParams = params;

  return new Ember.RSVP.Promise(function(resolve) {
    Ember.run.later(function() {
      resolve();
    }, 20);
  });
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
