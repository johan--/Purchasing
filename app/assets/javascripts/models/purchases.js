var attr = DS.attr;

App.Purchase = DS.Model.extend({
  vendor_string: attr(),
  requester: attr(),
  recipient: attr(),
  date_requested: attr(),
  starred: attr(),
  buyer: attr(),
  department: attr()
});

App.PurchaseAdapter = DS.RESTAdapter.extend();
