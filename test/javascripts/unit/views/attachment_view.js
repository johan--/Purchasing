
module('Attachment', {
  setup: function() {
    // Build fixtures
    fixtures.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/1/edit');
  },

  teardown: function() {
  }
});


test('Passing canDrag=true', function(){

  // Item is not draggable

});



test('Passing canDrag=false', function(){

  // Item is draggable

});


test('Passing canSelect=true', function(){

  // FancyBox is not setup

});


test('Passing canSelect=false', function(){

  // FancyBox is setup

});
