
// Add authorization rules to model
DS.Model.reopen({
  can_update: DS.attr('boolean', { defaultValue: true }),
  can_create: DS.attr('boolean', { defaultValue: true }),
  can_delete: DS.attr('boolean', { defaultValue: true })
});
