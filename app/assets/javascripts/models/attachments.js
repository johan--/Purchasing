
var attr = DS.attr;

App.Attachment = DS.Model.extend(App.MakeParentDirty, {

  parentObject: 'purchase',

  attachment_file_name: attr(),
  attachment_content_type: attr(),
  attachment_file_size: attr(),
  attachment_url: attr(),
  attachment_thumb_url: attr(),
  attachment_preview_url: attr(),
  category: attr(),

  created_at: attr('date', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING); } }),
  isDestroy: attr(),

  user: DS.belongsTo('user'),
  purchase: DS.belongsTo('purchase'),

  updateCategory: function(category) {
    this.set('category', category);
    this.save();
  }
});
