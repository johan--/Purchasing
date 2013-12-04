var attr = DS.attr;

App.Attachment = DS.Model.extend({
  attachment_file_name: attr(),
  attachment_content_type: attr(),
  attachment_file_size: attr(),
  attachment_url: attr(),
  attachment_thumb_url: attr(),
  attachment_preview_url: attr(),
  destroy: attr(),
  created_at: attr(),

  user: DS.belongsTo('user'),
  purchase: DS.belongsTo('purchase')
});

App.AttachmentAdapter = DS.RESTAdapter.extend();
