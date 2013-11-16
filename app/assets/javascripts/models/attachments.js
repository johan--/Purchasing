var attr = DS.attr;

App.Attachment = DS.Model.extend({
  attachment_file_name: attr(),
  attachment_content_type: attr(),
  attachment_file_size: attr(),
  destroy: attr(),

  purchase: DS.belongsTo('purchase')
});

App.AttachmentAdapter = DS.RESTAdapter.extend();
