Ember.Handlebars.helper('smallDate', function(date, options) {
  if (Ember.isEmpty(date))
    return;
  return moment(date).format('M-D-YY'); // 12-5-2013
});

Ember.Handlebars.helper('medDate', function(date, options) {
  if (Ember.isEmpty(date))
    return;
  return moment(date).format('MMM D'); // Dec 5
});

Ember.Handlebars.helper('largeDate', function(date, options) {
  if (Ember.isEmpty(date))
    return;
  return moment(date).format('MMM D h:mm A'); // Dec 5 12:15 PM
});
