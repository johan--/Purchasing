
App.ReceivingView = Ember.View.extend(App.DeleteableViewMixin, {
  templateName: 'purchase/receivings/item',
  tagName: 'tr',

  classNames: ['receiving'],
  classNameBindings: ['controller.isEditing'],


  mouseEnter: function() {
    this.get('controller').send('startHover');
  },


  mouseLeave: function() {
    this.get('controller').send('stopHover');
  },


  click: function() {
    if (this.get('controller.isEditing'))
      return;

    if (App.Session.currentUser.get('is_receiver'))
      this.get('controller').send('clickReceiving');
    return false;
  }
});
