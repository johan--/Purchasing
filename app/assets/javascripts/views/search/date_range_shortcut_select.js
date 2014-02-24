
App.DateRangeShortcutSelect = Ember.Select.extend({
  viewName: 'select',

  classNames: ['form-control'],

  contentBinding: 'shortcuts',
  prompt: 'Shortcuts',


  shortcuts: function() {
    return ['Two weeks ago', 'Last week', 'This week', 'Two months ago', 'Last month', 'This month'];
  }.property(),


  didChange: function() {
    var val = this.get('value'),
        shortcuts = this.get('shortcuts'),
        index = shortcuts.indexOf(val);

    var functions = ['twoWeeksAgo', 'lastWeek', 'thisWeek', 'twoMonthsAgo', 'lastMonth', 'thisMonth'];

    if (index < 0)
      return;

    this[functions[index]]();
    this.set('value', null);

  }.observes('value'),


  twoWeeksAgo: function() {
    var parent = this.get('parentView');
    parent.set('min', moment().day(-14).format(App.Globals.DATE_STRING));
    parent.set('max', moment().day(-8).format(App.Globals.DATE_STRING));
  },


  lastWeek: function() {
    var parent = this.get('parentView');
    parent.set('min', moment().day(-7).format(App.Globals.DATE_STRING));
    parent.set('max', moment().day(-1).format(App.Globals.DATE_STRING));
  },


  thisWeek: function() {
    var parent = this.get('parentView');
    parent.set('min', moment().day(0).format(App.Globals.DATE_STRING));
    parent.set('max', moment().day(6).format(App.Globals.DATE_STRING));
  },


  twoMonthsAgo: function() {
    var parent = this.get('parentView');
    parent.set('min', moment().subtract('months', 2).date(1).format(App.Globals.DATE_STRING));
    parent.set('max', moment().subtract('months', 1).date(1).subtract('day', 1).format(App.Globals.DATE_STRING));
  },


  lastMonth: function() {
    var parent = this.get('parentView');
    parent.set('min', moment().subtract('months', 1).date(1).format(App.Globals.DATE_STRING));
    parent.set('max', moment().date(1).subtract('day', 1).format(App.Globals.DATE_STRING));
  },


  thisMonth: function() {
    var parent = this.get('parentView');
    parent.set('min', moment().date(1).format(App.Globals.DATE_STRING));
    parent.set('max', moment().add('months', 1).date(1).subtract('day', 1).format(App.Globals.DATE_STRING));
  }
});
