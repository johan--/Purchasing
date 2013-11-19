App.PeopleTabsView = Ember.View.extend({
  templateName: 'purchase/people_tabs_view',
  classNames: ['person'],

  didInsertElement: function() {
    $("#tabs").tabs({
      event: "mouseover"
    });
  },

})
