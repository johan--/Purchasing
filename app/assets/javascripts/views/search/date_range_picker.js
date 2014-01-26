
App.DateRangePicker = Ember.View.extend({
  classNames: ['input-daterange', 'date'],
  templateName: 'views/date_range_picker',

  didInsertElement: function() {
    var id = this.$().attr('id'),
        queryParams = this.get('parentView.controller');

    this.set('min-value', queryParams[id + 'Min']);
    this.set('max-value', queryParams[id + 'Max']);

    this.$().datepicker({
      format: App.Globals.DATE_STRING_DATEBOX,
      autoclose: true,
      todayHighlight: true
    });
  },


  destroyDatepicker: function() {
    this.$().datepicker('destroy');
  }.on('willDestroyElement'),

});
