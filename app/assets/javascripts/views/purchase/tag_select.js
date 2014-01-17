
App.TagSelect = Ember.Select.extend({
  viewName: 'select',
  prompt: 'Add a Tag',

  classNames: ['form-control'],

  optionValuePath: 'content.id',
  optionLabelPath: 'content.name',


  change: function() {
    if (Ember.isEmpty(this.selection))
      return;
    this.get('controller').send('createTag', this.selection);
    this.set('selection', null);
  }
});
