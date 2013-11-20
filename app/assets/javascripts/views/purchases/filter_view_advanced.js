App.AdvancedFilterBoxView = Ember.View.extend({
  templateName: 'purchases/filter_view_advanced',
  classNames: ['advanced_filter_box'],

  didInsertElement: function() {
    this.$().hide();
  },

  closeFilter: function() {
    this.$().hide();
  },

  actions: {
    clearFilters: function() {
      this.set('buyer', 'All');
      this.set('controller.metadata.buyer', 'All');
      $('#minDate').val('');
      $('#maxDate').val('');
    },

    closeFilter: function() {
      this.$().hide();
    },

    applyFilter: function() {
      // These bindings only work one way
      var minDate = $('#minDate').val(),
          maxDate = $('#maxDate').val(),
          buyer = this.get('buyer'),
          filterReceiving = this.get('controller.metadata.filterReceiving'),
          filterPending = this.get('controller.metadata.filterPending');
          vendor = this.get('controller.metadata.vendor');

      this.get('controller').send('newPage', { buyer: buyer,
                                               filterMinDate: minDate,
                                               filterMaxDate: maxDate,
                                               filterReceiving: filterReceiving,
                                               filterPending: filterPending,
                                               vendor: vendor,
                                               page: 1 });
    },

    twoWeeksAgo: function() {
      $('#minDate').val(moment().day(-14).format(APP_DATE_STRING)),
      $('#maxDate').val(moment().day(-8).format(APP_DATE_STRING));
    },

    thisWeek: function() {
      $('#minDate').val(moment().day(0).format(APP_DATE_STRING)),
      $('#maxDate').val(moment().day(6).format(APP_DATE_STRING));
    },

    lastWeek: function() {
      $('#minDate').val(moment().day(-7).format(APP_DATE_STRING)),
      $('#maxDate').val(moment().day(-1).format(APP_DATE_STRING));
    },

    twoMonthsAgo: function() {
      $('#minDate').val(moment().subtract('months', 2).date(1).format(APP_DATE_STRING)),
      $('#maxDate').val(moment().subtract('months', 1).date(1).subtract('day', 1).format(APP_DATE_STRING));
    },

    thisMonth: function() {
      $('#minDate').val(moment().date(1).format(APP_DATE_STRING)),
      $('#maxDate').val(moment().add('months', 1).date(1).subtract('day', 1).format(APP_DATE_STRING));
    },

    lastMonth: function() {
      $('#minDate').val(moment().subtract('months', 1).date(1).format(APP_DATE_STRING)),
      $('#maxDate').val(moment().date(1).subtract('day', 1).format(APP_DATE_STRING));
    }
  }

})
