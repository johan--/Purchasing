
App.PaginatorView = Ember.View.extend({
  templateName: 'views/paginator',
  tagName: 'span',

  numButtons: 5,

  curPage: function() {
    return parseInt(this.get('controller.metadata.page'), 10);
  }.property('controller.metadata'),


  totalPages: function() {
    var total_count = parseInt(this.get('controller.metadata.total_count'), 10),
        per_page = parseInt(this.get('controller.metadata.per_page'), 10);

    return Math.ceil(1.0 * total_count / per_page);
  }.property('controller.metadata'),


  totalCount: function() {
    var metadata = this.get('controller.metadata');

    if (!isEmpty(metadata))
      return parseInt(metadata.total_count, 10) || 0;
    else
      return 0;
  }.property('controller.metadata'),


  foundRange: function() {
    var metadata = this.get('controller.metadata'),
        page = this.get('curPage'),
        numRecords = parseInt(metadata.found_count, 10),
        per_page = parseInt(metadata.per_page, 10) || numRecords,
        min = ((page - 1) * per_page),
        max = min + numRecords;

    return (min + 1) + '-' + max;

  }.property('controller.metadata', 'controller.model.length'),


  canPaginate: function() {
    return this.get('totalPages') > 0;
  }.property('totalPages'),


  buttons: function() {
    var curPage = this.get('curPage'),
        totalPages = this.get('totalPages'),
        numButtons = this.get('numButtons'),
        items = [];

    var totalButtons = (totalPages >= numButtons) ? numButtons : totalPages,
        middleButton = Math.floor(totalButtons/2);

    var getMinPage = function() {

      if (totalPages === totalButtons || curPage <= middleButton)
        return 1;

      // If we are in the first two pages...
      if (curPage > middleButton && curPage < totalPages - middleButton)
        return curPage - middleButton;

      // If we are in the last two pages...
      if (curPage >= totalPages - totalButtons) {
        return totalPages - totalButtons + 1;
      }

      return 1;
    };

    for(var i = 0; i < totalButtons; i++){
      var thisPage = getMinPage() + i;
      items.push({ page: thisPage, isCurrent: curPage === thisPage });
    }

    return items;

  }.property('controller.metadata'),


  canNext: function() {
    return this.get('curPage') < this.get('totalPages');
  }.property('curPage', 'totalPages'),


  canNotNext: function() {
    return !this.get('canNext');
  }.property('canNext'),


  canPrevious: function() {
    return this.get('curPage') > 1;
  }.property('curPage'),


  canNotPrevious: function() {
    return !this.get('canPrevious');
  }.property('canPrevious'),


  actions: {

    goFirst: function() {
      if (this.get('curPage') > 1)
        this.get('controller').send('page', 1);
    },


    goNext: function() {
      if (this.get('canNext'))
        this.get('controller').send('page', this.get('curPage') + 1);
    },


    goPage: function(page) {
      if (page)
        this.get('controller').send('page', page);
    },


    goPrevious: function() {
      if (this.get('canPrevious'))
        this.get('controller').send('page', this.get('curPage') - 1);
    },


    goLast: function() {
      var lastPage = this.get('totalPages');
      if (this.get('curPage') < lastPage)
        this.get('controller').send('page', lastPage);
    },
  }
});
