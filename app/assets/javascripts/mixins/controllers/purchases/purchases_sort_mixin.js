
App.PurchasesControllerSorterMixin = Ember.Mixin.create({

  sortDate: Ember.computed.equal('metadata.sort', 'dateRequested'),
  sortVendor: Ember.computed.equal('metadata.sort', 'vendor_string'),
  sortRequester: Ember.computed.equal('metadata.sort', 'requester.name'),
  sortDepartment: Ember.computed.equal('metadata.sort', 'requester.department'),
  sortBuyer: Ember.computed.equal('metadata.sort', 'buyer.name'),

  currentSortIsAscending: Ember.computed.equal('metadata.direction', 'ASC'),


  sortDescendingClass: function(){
    return (this.get('currentSortIsAscending')) ? 'fa fa-sort-up fa-stack-1x' : 'fa fa-sort-down fa-stack-1x';
  }.property('currentSortIsAscending'),


  actions: {

    sortClick: function(field) {
      var cur_field = this.get('metadata.sort'),
          cur_direction = this.get('metadata.direction'),
          direction = (field === 'dateRequested') ? 'DESC' : 'ASC';

      if (cur_field === field)
        direction = this._rotateDirection(cur_direction);

      this.newPage({ sort: field, direction: direction, purPage: 1, searchPage: 1 });
      return false;
    }
  },

  _rotateDirection: function(direction) {
    return (direction === 'ASC') ? 'DESC' : 'ASC';
  }
});
