
App.DatePickerInput = Ember.TextField.extend({
  classNames: ['form-control'],

  didInsertElement: function() {
    this.$().datepicker({
      format: App.Globals.DATE_STRING_DATEBOX,
      autoclose: true,
      todayHighlight: true
    });

    // First, set the datepicker's internal value
    var value = this.get('parentView.value');
    this.$().datepicker('setDate', value);

    // Second, manually build binding
    // (if we did this first then setting the datepicker would flag the record as dirty)
    var binding = Ember.Binding.from('parentView.value').to('value');
    binding.connect(this);
  },

  willDestroyElement: function() {
    this.$().datepicker('remove');
  }
});
