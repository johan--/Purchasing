
App.FocusableBoxAutoSendView = Ember.TextField.extend({
  oldVal: null,
  placeholder: 'Search',
  id: 'search_box_input',
  valueBinding: 'targetObject.metadata.search',

  searchBoxInterval: null,


  focusIn: function(){
    this.oldVal = this.$().val();
    this.$().parent().addClass('focused');
  },


  focusOut: function(){
    this.$().parent().removeClass('focused');
  },


  keyUp: function() {
    var self = this;
    Ember.run.cancel(this.searchBoxInterval);
    this.searchBoxInterval = Ember.run.later(self, function(){ self.startQuery(); }, 1000);
  },


  startQuery: function() {
    var val = this.$().val(),
        oldVal = this.oldVal;

    if (!isEmpty(val) && val.length > 3 && val != oldVal) {
      this.oldVal = val;
      this.get('targetObject').send('startSearch', val);
    }
  }
});
