
App.DateRangePicker = Ember.View.extend({

  classNames: ['input-daterange', 'date'],
  templateName: 'views/date_range_picker',
  classNameBindings: ['baseName'],

  min: null,
  max: null,

  value: function(key, value, oldValue) {

    if (arguments.length === 1) {
      return [this.get('min'), this.get('max')];
    } else {
      if (isEmpty(value)) {
        this.set('min', null);
        this.set('max', null);
      }
    }
  }.property('min', 'max'),


  initValues: function() {
    var baseName = this.get('baseName'),
        controller = this.get('parentView.controller'),
        min = controller[baseName + 'Min'],
        max = controller[baseName + 'Max'];

    this.set('min', min);
    this.set('max', max);
  },


  didInsertElement: function() {
    this.initValues();

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
