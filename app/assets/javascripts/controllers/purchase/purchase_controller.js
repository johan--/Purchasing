App.PurchaseController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, App.PurchaseControllerMixin, {

  buyerInitials: function() {
    var buyer = this.get('buyer'),
        res = '';

    if (!isEmpty(buyer)) {
      var buyerArray = buyer.name.split(' ');

      for(i = 0; i < buyerArray.length; i++)
        res += buyerArray[i][0].toUpperCase();
    }

    return res;
  }.property('buyer'),


  title: function() {
    var self = this,
        lines = this.get('lineItems');

    if (lines) {
      return lines.reduce(function(result, line){
        var line_class = self.getClassForLineItemTooltip(line);

        return result += '<li class="' + line_class + '">' + line.get('description') || '' + '</li>';
      }, '<ul class="row_tooltip">');
    }
  }.property('lineItems.@each'),


  canHaveActionControls: function() {
    var tab = this.get('metadata.tab');
    return tab === 'New' || tab === 'Purchased' || tab === 'Reconciled';
  }.property('metadata'),


  actions: {

    selectRecord: function() {
      this.set('isSelected', !this.get('isSelected'));
    },


    starMe: function() {
      var self = this,
          record = this.get('model'),
          store = record.get('store'),
          application = self.application;

      this.application.clearNotifications();
      $('.main_spinner').show();

      $.post('/purchases/' + record.id + '/toggle_starred').then(function(data) {

        application.notify({ message: 'Star updated', type: 'notice' });
        $('.main_spinner').hide();

        if (data && data.purchase)
          record.set('starred', data.purchase.starred);

      }, function(error) {
        $('.main_spinner').hide();
        application.notify({ message: 'Failed to update Star: ' + error.responseText, type: 'error' });
      });

      return false;
    },
  },


  getClassForLineItemTooltip: function(line) {
    var quantity = line.get('quantity') || 0,
        received = line.get('received_count_server') || 0;

    if (quantity === 0 || received === 0)
      return '';
    else if (received >= quantity)
      return 'complete';
    else
      return 'partial';
  },


  dateExpectedString: function() {
    var dateExpected = this.get('dateExpected');

    if (dateExpected)
      return 'Item was expected to arrive on ' + moment(dateExpected).format(App.Globals.DATE_STRING);

  }.property('dateExpected'),


  dateExpectedPastDue: function() {
    var dateExpected = this.get('dateExpected'),
        pastDue = moment().subtract('weeks', 2);

    if (!isEmpty(dateExpected))
      return pastDue > moment(dateExpected);
    else
      return false;
  }.property('dateExpected')
});
