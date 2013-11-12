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
      $('#minDate').val(moment().day(-14).format('MMM D, YYYY')),
      $('#maxDate').val(moment().day(-8).format('MMM D, YYYY'));
    },

    thisWeek: function() {
      $('#minDate').val(moment().day(0).format('MMM D, YYYY')),
      $('#maxDate').val(moment().day(6).format('MMM D, YYYY'));
    },

    lastWeek: function() {
      $('#minDate').val(moment().day(-7).format('MMM D, YYYY')),
      $('#maxDate').val(moment().day(-1).format('MMM D, YYYY'));
    },

    twoMonthsAgo: function() {
      $('#minDate').val(moment().subtract('months', 2).date(1).format('MMM D, YYYY')),
      $('#maxDate').val(moment().subtract('months', 1).date(1).subtract('day', 1).format('MMM D, YYYY'));
    },

    thisMonth: function() {
      $('#minDate').val(moment().date(1).format('MMM D, YYYY')),
      $('#maxDate').val(moment().add('months', 1).date(1).subtract('day', 1).format('MMM D, YYYY'));
    },

    lastMonth: function() {
      $('#minDate').val(moment().subtract('months', 1).date(1).format('MMM D, YYYY')),
      $('#maxDate').val(moment().date(1).subtract('day', 1).format('MMM D, YYYY'));
    }
  }

})
