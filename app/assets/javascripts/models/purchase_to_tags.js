var attr = DS.attr;

App.PurchaseToTag = DS.Model.extend({
  purchase_id: attr(),
  tag_id: attr(),

  purchase: DS.belongsTo('purchase')
  // Can't build a relationship to tag since the server wasn't able to push the related id's
});

App.LineItemAdapter = DS.RESTAdapter.extend();
