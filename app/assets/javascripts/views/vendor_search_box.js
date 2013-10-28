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
    if (!Ember.isEmpty(val) && val.length > 3 && val != this.get('targetObject.metadata.search')) {
      this.get('targetObject').send('startSearch', val);
    }
  }
})

searchBoxInterval = null;

// https://github.com/emberjs/ember.js/commit/326af5a9c88df76f5effe11156a07b64c8b178a3#packages/ember-handlebars/lib/controls/text_support.js
