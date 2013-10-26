Ember.Handlebars.helper('get_url', function(url, options) {
  prefix = (url.indexOf('@') != -1) ? 'mailto://' : 'http://';
  return prefix + url;
});
