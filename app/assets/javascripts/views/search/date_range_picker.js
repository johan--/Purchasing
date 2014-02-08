
App.DateRangePicker = Ember.View.extend({
  classNames: ['input-daterange', 'date'],
  templateName: 'views/date_range_picker',

  didInsertElement: function() {
    var id = this.$().attr('id'),
        queryParams = this.get('parentView.controller'),
        min = queryParams[id + 'Min'],
        max = queryParams[id + 'Max'];

    this.set('min-value', min);
    this.set('max-value', max);

    this.$().datepicker({
      format: App.Globals.DATE_STRING_DATEBOX,
      autoclose: true,
      todayHighlight: true
    });

  },


  willDestroyElement: function() {
    this.$().datepicker('remove');
    this._super();
  }
});
