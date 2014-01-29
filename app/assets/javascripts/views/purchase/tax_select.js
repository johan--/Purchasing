
App.TaxSelect = Ember.Select.extend({
  viewName: 'select',
  classNames: ['form-control'],

  contentBinding: 'taxCodes',
  valueBinding: 'taxCurrent',


  taxCodes: function() {
    return App.Globals.tax_codes;
  }.property(),


  taxCurrent: function() {
    return this.get('controller.model.tax_rate');
  }.property('controller.tax_rate'),


  change: function() {
    this.get('controller').send('stopEditingTaxRate');
    if (isEmpty(this.selection))
      return;
    this.get('controller').set('tax_rate', this.selection);
  }
});
