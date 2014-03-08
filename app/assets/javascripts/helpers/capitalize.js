
Ember.Handlebars.helper('capitalize', function(str, options) {
  if (typeof str === 'string')
    return str.capitalize();
  else
    return str;
});
