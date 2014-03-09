
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


  didInsertElement: function() {
    var lastID = App.Session.get('lastRequisitionID'),
        id = this.get('context.id');

    if (id === lastID) {
      this.rowHighlight();
      App.Session.set('lastRequisitionID', null);
    }
  },


  rowHighlight: function() {
    var el = this.$(),
        bgColor = el.css('backgroundColor');

    el.addClass('highlight')
      .stop()
      .animate({ backgroundColor: bgColor }, 2500, 'swing', function(){
        el.removeClass('highlight');
      });
  }

});
