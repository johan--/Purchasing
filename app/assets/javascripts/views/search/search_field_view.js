
App.SearchFieldView = Ember.TextField.extend({
  oldVal: null,
  placeholder: 'Search',
  classNames: ['search_box_input'],
  valueBinding: 'targetObject.metadata.search',


  focusIn: function(){
    this.oldVal = this.$().val();
    this.$().parent().addClass('focused');
  },


  focusOut: function(){
    this.$().parent().removeClass('focused');
  }
});
