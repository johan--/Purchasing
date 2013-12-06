
App.ReceivingView = Ember.View.extend(App.DeleteableViewMixin, {
  templateName: 'purchase/receiving',
  classNameBindings: ['controller.isEditing'],


  mouseEnter: function() {
    this.get('controller').send('startHover', this);
  },


  mouseLeave: function() {
    this.get('controller').send('stopHover', this);
  }
});
