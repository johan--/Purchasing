
module('Unit - Controllers - Attachment', {
  setup: function() {
    // Build fixtures
    fixtures.reset();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/1/edit');
  },

  teardown: function() {

  }
});


// titleText
// progressAmountStyle
// progressText
// updateCategoryAndPurchase
