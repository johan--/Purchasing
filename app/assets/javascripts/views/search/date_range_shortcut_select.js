
App.DateRangeShortcutSelect = Ember.Select.extend({
  viewName: 'select',

  classNames: ['form-control'],

  contentBinding: 'shortcuts',
  prompt: '-Shortcuts-',


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
    this.$().siblings('input[name*="start"]').val(moment().day(-14).format(App.Globals.DATE_STRING));
    this.$().siblings('input[name*="end"]').val(moment().day(-8).format(App.Globals.DATE_STRING));
  },


  lastWeek: function() {
    this.$().siblings('input[name*="start"]').val(moment().day(-7).format(App.Globals.DATE_STRING));
    this.$().siblings('input[name*="end"]').val(moment().day(-1).format(App.Globals.DATE_STRING));
  },


  thisWeek: function() {
    this.$().siblings('input[name*="start"]').val(moment().day(0).format(App.Globals.DATE_STRING));
    this.$().siblings('input[name*="end"]').val(moment().day(6).format(App.Globals.DATE_STRING));
  },


  twoMonthsAgo: function() {
    this.$().siblings('input[name*="start"]').val(moment().subtract('months', 2).date(1).format(App.Globals.DATE_STRING));
    this.$().siblings('input[name*="end"]').val(moment().subtract('months', 1).date(1).subtract('day', 1).format(App.Globals.DATE_STRING));
  },


  lastMonth: function() {
    this.$().siblings('input[name*="start"]').val(moment().subtract('months', 1).date(1).format(App.Globals.DATE_STRING));
    this.$().siblings('input[name*="end"]').val(moment().date(1).subtract('day', 1).format(App.Globals.DATE_STRING));
  },


  thisMonth: function() {
    this.$().siblings('input[name*="start"]').val(moment().date(1).format(App.Globals.DATE_STRING));
    this.$().siblings('input[name*="end"]').val(moment().add('months', 1).date(1).subtract('day', 1).format(App.Globals.DATE_STRING));
  }
});
