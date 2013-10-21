var attr = DS.attr;

App.Vendor = DS.Model.extend({
  name: attr(),
  purchases: DS.belongsTo('purchase')
});

App.VendorAdapter = DS.RESTAdapter.extend();
