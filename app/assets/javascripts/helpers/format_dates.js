
Ember.Handlebars.helper('smallDate', function(date, options) {
  if (isEmpty(date))
    return;
  return moment(date).format(App.Globals.DATE_STRING_SMALL); // 12-5-2013
});

Ember.Handlebars.helper('medDate', function(date, options) {
  if (isEmpty(date))
    return;
  return moment(date).format(App.Globals.DATE_STRING_MED); // Dec 5
});

Ember.Handlebars.helper('largeDate', function(date, options) {
  if (isEmpty(date))
    return;
  return moment(date).format(App.Globals.DATE_STRING_FULL); // Dec 5 12:15 PM
});
