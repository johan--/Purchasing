
App.ReceivingView = Ember.View.extend(App.DeleteableViewMixin, {
  templateName: 'purchase/receivings/item',
  tagName: 'tr',

  classNames: ['receiving'],
  classNameBindings: ['controller.isEditing'],


  mouseEnter: function() {
    this.get('controller').send('startHover', this);
  },


  mouseLeave: function() {
    this.get('controller').send('stopHover', this);
  },


  actions:{
    openEdit: function() {
      this.get('controller').send('clickReceiving');
      return false;
    }
  }
});
