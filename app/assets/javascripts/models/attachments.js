
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

  created_at: attr('string', { defaultValue: function() { return moment().format(App.Globals.DATE_STRING_FULL); } }),
  isDestroy: attr(),

  user: DS.belongsTo('user'),
  purchase: DS.belongsTo('purchase'),

  updateCategoryAndPurchase: function(category, purchase) {
    this.set('category', category);
    this.set('purchase', purchase);
    this._data.purchase = (purchase) ? purchase.id : null;
    this.save();
  }
});
