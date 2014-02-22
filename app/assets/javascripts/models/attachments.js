
var attr = DS.attr;

App.Attachment = DS.Model.extend({

  attachment_file_name: attr(),
  attachment_content_type: attr(),
  attachment_file_size: attr(),
  attachment_url: attr(),
  attachment_thumb_url: attr(),
  attachment_preview_url: attr(),
  category: attr(),
  purchase_id_server: attr(), // Used to track server's relationship

  created_at: attr('string', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING_FULL); } }),
  isDestroy: attr(),

  user: DS.belongsTo('user'),
  purchase: DS.belongsTo('purchase'),

  hasPurchaseID: Ember.computed.bool('purchase_id_server'),
  isNotDeleted: Ember.computed.not('isDeleted')
});
