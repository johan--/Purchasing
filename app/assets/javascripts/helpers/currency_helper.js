Ember.Handlebars.helper('currency', function(number, options) {
  return toCurrency(number);
});

Ember.Handlebars.helper('percent', function(number, options) {
  return '%' + parseFloat(number).toFixed(2);
});
