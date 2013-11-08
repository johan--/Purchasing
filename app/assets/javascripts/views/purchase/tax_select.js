
App.TaxSelect = Ember.Select.extend({
  contentBinding: 'taxCodes',
  taxCodes: [.1, .0975, .095, .0925, .09, .0875, .085, .0825, .08],

  change: function() {
    if (Ember.isEmpty(this.selection))
      return;
    this.get('controller').set('tax_rate', this.selection);
  }
});
