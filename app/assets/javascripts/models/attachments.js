var attr = DS.attr;

App.Attachment = DS.Model.extend({
  attachment_file_name: attr(),
  attachment_content_type: attr(),
  attachment_file_size: attr(),
  attachment_url: attr(),
  attachment_thumb_url: attr(),
  attachment_preview_url: attr(),
  category: attr(),
  isDestroy: attr(),
  created_at: attr(),

  user: DS.belongsTo('user'),
  purchase: DS.belongsTo('purchase'),

  updateCategory: function(category) {
    this.set('category', category);

    this.save();
  }
});

App.AttachmentAdapter = DS.RESTAdapter.extend();
