
var attr = DS.attr;

App.Vendor = DS.Model.extend({

  name: attr(),
  website: attr(),
  email: attr(),
  address: attr(),
  city: attr(),
  state: attr(),
  zip_code: attr(),
  country: attr(),
  phone: attr(),
  fax: attr(),
  account_num: attr(),
  comments: attr(),

  created_at: attr('string', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING_FULL); } }),
  updated_at: attr('string', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING_FULL); } }),

  num_purchases: attr(), // count from server

  purchases: DS.belongsTo('purchase'),


  website_url: function() {
    return this.build_url(this.get('website'));
  }.property('website'),


  email_url: function() {
    return this.build_url(this.get('email'));
  }.property('email'),


  build_url: function(url) {
    if (isEmpty(url) || Ember.typeOf(url) !== 'string')
      return;

    var prefix = (url.indexOf('@') !== -1) ? 'mailto://' : 'http://';
    return prefix + url;
  }
});
