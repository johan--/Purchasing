
App.ReceivingView = Ember.View.extend(App.DeleteableViewMixin, {
  templateName: 'purchase/receiving',
  tagName: 'tr',

  classNames: ['receiving'],
  classNameBindings: ['controller.isEditing'],


  click: function() {
    if (this.get('parentController.purchase.isEditing') === true)
      this.get('controller').send('clickReceiving');
  },


  mouseEnter: function() {
    this.get('controller').send('startHover', this);
  },


  mouseLeave: function() {
    this.get('controller').send('stopHover', this);
  }
});
