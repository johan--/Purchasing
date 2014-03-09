
var attr = DS.attr;

App.Note = DS.Model.extend({

  text: attr(),

  created_at: attr(),
  updated_at: attr(),
  user_name: attr(),
  isDestroy: attr(),

  belongs_to_me: attr('boolean', { defaultValue: true }),

  purchase: DS.belongsTo('purchase')
});
