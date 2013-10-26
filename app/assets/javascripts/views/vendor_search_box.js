App.VendorSearchBox = Ember.TextField.extend({
  classNames: ['vendor_search'],
  placeholder: 'Filter Vendors by Name',

  value: function() {
    return this.get('targetObject.metadata.search');
  }.property('targetObject.metadata'),

  keyUp: function() {
    clearInterval(searchBoxInterval);
    parent = this;
    searchBoxInterval = setTimeout(function(){ parent.startQuery(); }, 1500);
  },

  startQuery: function() {
    val = this.get('value');
    if (val != '' && val.length > 3 && val != this.get('targetObject.metadata.search')) {
      this.get('targetObject').send('startSearch', val);
    }
  }
})

searchBoxInterval = null;
