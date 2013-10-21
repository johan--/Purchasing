var attr = DS.attr;

App.Attachment = DS.Model.extend({
  attachment_file_name: attr(),
  purchases: DS.belongsTo('purchase')
});

App.AttachmentAdapter = DS.RESTAdapter.extend();
