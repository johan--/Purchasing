
App.TaxSelect = Ember.Select.extend({
  viewName: 'select',

  contentBinding: 'taxCodes',
  valueBinding: 'taxCurrent',

  metadata: function() {
    if (this.get('controller.model.isLoaded'))
      return this.get('controller.store').metadataFor('purchase');
  }.property('controller.model.isLoaded'),

  taxCodes: function() {
    return this.get('metadata.taxCodes');
  }.property('metadata.taxCodes'),

  taxCurrent: function() {
    return this.get('controller.model.tax_rate');
  }.property('controller.tax_rate'),

  change: function() {
    this.get('controller').send('stopEditingTaxRate');
    if (Ember.isEmpty(this.selection))
      return;
    this.get('controller').set('tax_rate', this.selection);
  }
});
