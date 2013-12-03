
var testing = function(){
  var helper = {
    container: function(){
      return App.__container__;
    },
    controller: function( name ){
      return helper.container().lookup('controller:' + name);
    },
    path: function(){
      return helper.controller('application').get('currentPath');
    }
  };
  return helper;
};

Ember.Test.registerHelper('path', function() {
  return testing().path();
});

Ember.Test.registerHelper('getPurchases', function() {
  return testing().controller('purchases');
});

function exists(selector) {
  return !!find(selector).length;
}
