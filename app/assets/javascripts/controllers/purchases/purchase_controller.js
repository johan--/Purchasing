App.PurchaseController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, App.PurchaseControllerMixin, {

  oldHoverView: null,

  buyerInitials: function() {
    var buyerName = this.get('buyer.name'),
        res = '';

    if (!isEmpty(buyerName)) {
      var buyerArray = buyerName.split(' ');

      buyerArray.forEach(function(name, i) {
        res += buyerArray[i][0].toUpperCase();
      });
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


  isCurrentlyHovering: function() {
    var hoverDoc_id = this.get('parentController.hoverDoc.id'),
        model_id = this.get('model.id');

    return hoverDoc_id === model_id;
  }.property('parentController.hoverDoc'),


  actions: {

    selectRecord: function() {
      this.set('isSelected', !this.get('isSelected'));
    },


    hoverMe: function() {
      var controller = this.get('parentController'),
          hoverDoc = controller.get('hoverDoc'),
          isHovering = this.get('isCurrentlyHovering'),
          model = this.get('model');

      if (isHovering)
        controller.set('hoverDoc', null);
      else
        controller.set('hoverDoc', model);
    },


    starMe: function() {
      var self = this,
          record = this.get('model'),
          store = record.store,
          application = self.application;

      $('.main_spinner').show();

      $.ajax({
        type: 'POST',
        url: App.Globals.namespace + '/purchases/' + record.id + '/toggle_starred'
      }).then(function(data) {
        Ember.run(function() {

          application.notify({ message: 'Star updated', type: 'notice' });
          $('.main_spinner').hide();

          if (data && data.purchase)
            record.set('starred', data.purchase.starred);

        });
      }, function(error) {
        Ember.run(function() {

          $('.main_spinner').hide();
          application.notify({ message: 'Failed to update Star: ' + error.responseText, type: 'error' });

        });
      });

      return false;
    },
  },


  dateExpectedString: function() {
    var dateExpected = this.get('dateExpected');

    if (dateExpected)
      return 'Item was expected to arrive on ' + moment(dateExpected).format(App.Globals.DATE_STRING);

  }.property('dateExpected'),


  dateExpectedPastDue: function() {
    var dateExpected = this.get('dateExpected'),
        pastDue = moment().subtract('weeks', 2),
        received = this.get('received');

    if (received)
      return false;

    if (!isEmpty(dateExpected))
      return pastDue > moment(dateExpected);
    else
      return false;
  }.property('dateExpected')
});
