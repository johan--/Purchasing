
module('Integration - Vendors - Pagination', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    fixtures.reset();

    App.reset();
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {
  }
});


test('Pagination with 3 pages', function() {
  expect(16);
  META_FIXTURE.total_count = 45;

  visit('/vendors?vendorPage=1').then(function() {

    equal(find(buttons.pageNumbers).length, 3, '3 Pages are listed');

    equal(find(buttons.pageFirst).attr('class'), 'disabled', 'First Page button is disabled on first page with 3 pages');
    equal(find(buttons.pagePrevious).attr('class'), 'disabled', 'Previous Page button is disabled on first page with 3 pages');
    equal(find(buttons.pageNext).attr('class'), '', 'Next Page button is enabled on first page with 3 pages');
    equal(find(buttons.pageLast).attr('class'), '', 'Last Page button is enabled on first page with 3 pages');

    equal(find(buttons.pageNumbers).eq(0).attr('class'), 'active', 'Page 1 button is active');

    META_FIXTURE.total_count = 45;
    META_FIXTURE.page = 2;

    return click(find(buttons.pageNumbers).eq(1));

  }).then(function() {

    equal(find(buttons.pageFirst).attr('class'), '', 'First Page button is enabled on page 2 with 3 pages');
    equal(find(buttons.pagePrevious).attr('class'), '', 'Previous Page button is enabled on page 2 with 3 pages');
    equal(find(buttons.pageNext).attr('class'), '', 'Next Page button is enabled on page 2 with 3 pages');
    equal(find(buttons.pageLast).attr('class'), '', 'Last Page button is enabled on page 2 with 3 pages');

    equal(find(buttons.pageNumbers).eq(1).attr('class'), 'active', 'Page 2 button is active');

    META_FIXTURE.total_count = 45;
    META_FIXTURE.page = 3;

    return click(find(buttons.pageNumbers).eq(2));

  }).then(function() {

    equal(find(buttons.pageFirst).attr('class'), '', 'First Page button is enabled on last page with 3 pages');
    equal(find(buttons.pagePrevious).attr('class'), '', 'Previous Page button is enabled on last page with 3 pages');
    equal(find(buttons.pageNext).attr('class'), 'disabled', 'Next Page button is disabled on last page with 3 pages');
    equal(find(buttons.pageLast).attr('class'), 'disabled', 'Last Page button is disabled on last page with 3 pages');

    equal(find(buttons.pageNumbers).eq(2).attr('class'), 'active', 'Page 3 button is active');

  });
});


test('Pagination with one page', function() {
  expect(5);
  visit('/vendors').then(function() {

    equal(find(buttons.pageFirst).attr('class'), 'disabled', 'First Page button is disabled with 1 page');
    equal(find(buttons.pagePrevious).attr('class'), 'disabled', 'First Page button is disabled with 1 page');
    equal(find(buttons.pageNext).attr('class'), 'disabled', 'First Page button is disabled with 1 page');
    equal(find(buttons.pageLast).attr('class'), 'disabled', 'First Page button is disabled with 1 page');

    equal(find(buttons.pageNumbers).length, 1, '1 Page is listed');

  });
});

