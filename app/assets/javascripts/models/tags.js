
var attr = DS.attr;

// This is not a representation of the tag model on the server
// This acts sort of as a proxy for PurchaseToTags (but the server data is stored on App.PurchaseToTags)
App.Tag = DS.Model.extend({

  name: attr(),
  isDestroy: attr(),

  purchase: DS.belongsTo('purchase'),

  isEditing: false

});
