
var attr = DS.attr;

App.User = DS.Model.extend({

  username: attr(),
  name: attr(),
  title: attr(),
  email: attr(),
  department: attr(),
  phone: attr(),
  photo_url: attr(),
  current_login_at: attr(),
  last_login_at: attr(),
  login_count: attr(),
  number_accounts: attr(),

  accounts: DS.hasMany('account'),

});
