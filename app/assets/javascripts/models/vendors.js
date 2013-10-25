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
  created_at: attr(),
  updated_at: attr(),
  purchases: DS.belongsTo('purchase')
});

App.VendorAdapter = DS.RESTAdapter.extend();
