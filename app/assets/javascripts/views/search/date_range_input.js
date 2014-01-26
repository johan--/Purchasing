
App.DateRangeInput = Ember.TextField.extend({
  classNames: ['input-small', 'form-control'],

  // Don't use binding since our value is from queryParams

  didInsertElement: function() {
    var name = this.get('name'),
        valueName = (name === 'start') ? 'min-value' : 'max-value',
        value = this.get('parentView').get(valueName);

    this.$().datepicker('setDate', value);
  },

  destroyDatepicker: function() {
    this.$().datepicker('destroy');
  }.on('willDestroyElement')
});


