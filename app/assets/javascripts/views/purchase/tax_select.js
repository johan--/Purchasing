
App.TaxSelect = Ember.Select.extend({
  viewName: 'select',

  contentBinding: 'taxCodes',
  valueBinding: 'taxCurrent',

  taxCodes: ['%0.0', '%10.0', '%9.75', '%9.5', '%9.25', '%9.0', '%8.75', '%8.5', '%8.25', '%8.0'],

  taxCurrent: function() {
    console.log(this.get('controller.tax_rate'));
    console.log(this.get('controller.model.tax_rate'));
    return this.get('controller.model.tax_rate');
  }.property('controller.tax_rate'),

  change: function() {
    this.get('controller').send('stopEditingTaxRate');
    if (Ember.isEmpty(this.selection))
      return;
    this.get('controller').set('tax_rate', this.selection);
  }
});
