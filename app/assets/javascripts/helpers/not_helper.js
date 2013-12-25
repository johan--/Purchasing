
Ember.Handlebars.helper('not', function(attr){
  return !this.get(attr);
});
