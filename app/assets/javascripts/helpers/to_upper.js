
Ember.Handlebars.helper('toUpper', function(val, options) {
  if (Ember.typeOf(val) === 'string')
    return val.charAt(0).toUpperCase() + val.slice(1);
  else
    return val;
});
