
App.PurchasesControllerSorterMixin = Ember.Mixin.create({

  sortDate:         function(){ return this.findSort('dateRequested');        }.property('metadata'),
  sortVendor:       function(){ return this.findSort('vendorString');         }.property('metadata'),
  sortRequester:    function(){ return this.findSort('requester.name');       }.property('metadata'),
  sortDepartment:   function(){ return this.findSort('requester.department'); }.property('metadata'),
  sortBuyer:        function(){ return this.findSort('buyer.name');           }.property('metadata'),
  findSort: function(field) {
    return this.get('currentSortFieldName') == field;
  },


  currentSortFieldName: function() {
    return this.get('metadata.sort');
  }.property('metadata.sort'),


  currentSortIsAscending: function() {
    return this.get('metadata.direction') == 'ASC';
  }.property('metadata.direction'),


  sortDescending: function(){
    if (this.get('currentSortIsAscending'))
      return 'fa fa-sort-up fa-stack-1x';
    else
      return 'fa fa-sort-down fa-stack-1x';
  }.property('currentSortIsAscending'),


  actions: {

    sortClick: function(field) {
      cur_sort = this.get('metadata.sort');
      cur_dir = this.get('metadata.direction');

      if (cur_sort === field)
        dir = (cur_dir === 'ASC') ? 'DESC' : 'ASC';
      else
        dir = (field === 'dateRequested') ? 'DESC' : 'ASC';

      this.newPage({ sort: field, direction: dir, purPage: 1, searchPage: 1 });
      return false;
    }
  }
});
