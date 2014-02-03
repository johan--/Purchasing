
App.PurchasesRowView = Ember.View.extend({
  templateName: 'purchases/row',
  classNames: ['purchase'],
  classNameBindings: ['controller.isSelected', 'controller.dateExpectedPastDue:past-due', 'controller.received_server:all-received'],
  tagName: 'tr',


  click: function(e) {
    if(!$(e.toElement).is('.dropdown-toggle, .caret') && this.get('controller.canHaveActionControls') === true) {
      this.get('controller').send('selectRecord');
    }
  },


  mouseEnter: function() {
    this.set('isHovering', true);
    this.mouseLeave();

    var controller = this.get('controller'),
        hoverAbove = true; // Temporary

    var newView = Ember.View.create({
          classNames: ['purchase_row_hover', hoverAbove],
          templateName: 'purchases/row_hover',
          controller: controller
        });

    this.createChildView(newView);
    newView.append();

    this.set('oldView', newView);
  },


  mouseLeave: function() {
    var oldView = this.get('oldView');

    if (oldView) {
      this.removeChild(oldView);
      oldView.destroy();
      this.set('oldView', null);
    }
  },


  willDestroyElement: function() {
    this.mouseLeave();
  },


  actions: {

    starMe: function() {
      this.get('controller').send('starMe');
      return false;
    },


    openRecordEdit: function() {
      this.get('controller').send('openRecordEdit');
      return false;
    },


    openRecordShow: function() {
      this.get('controller').send('openRecordShow');
      return false;
    },


    deleteMe: function() {
      this.get('controller').send('deleteRecord', this.$());
      return false;
    }
  }
});
