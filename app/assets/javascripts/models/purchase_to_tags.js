
var attr = DS.attr;

// This object is only used to store the relational data from the server.
// Adding a tag to a Purchase involves creating a new App.Tag record, the serializer will take care of translating this

App.PurchaseToTag = DS.Model.extend({

  purchase_id: attr(),
  tag_id: attr(),

  purchase: DS.belongsTo('purchase')
  // Can't build a relationship to tag since the server wasn't able to push the related id's
});
