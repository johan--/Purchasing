
App.PurchaseController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, App.PurchaseControllerMixin, {

  oldHoverView: null,

  buyerInitials: function() {
    var buyerName = this.get('buyer.name');

    if (!isEmpty(buyerName)) {
      return buyerName.split(' ').reduce(function(result, item) {
        return result + item[0].toUpperCase();
      }, '');
    }
  }.property('buyer'),


  canHaveActionControls: function() {
    return false;
    /*
    if (!App.current_user.get('is_buyer'))
      return;

    var tab = this.get('parentController.tab');

    return tab === 'New' || tab === 'Purchased' || tab === 'Reconciled';
    */
  }.property('metadata'),


  isCurrentlyHovering: function() {
    var hoverDoc_id = this.get('parentController.hoverDoc.id'),
        model_id = this.get('model.id');

    return hoverDoc_id === model_id;
  }.property('parentController.hoverDoc'),


  actions: {

    openRecordEdit: function() {
      var record = this.get('model');
      this.transitionToRoute('purchase.edit', record);
      return false;
    },


    openRecordShow: function() {
      var record = this.get('model');
      this.transitionToRoute('purchase.show', record);
      return false;
    },


    selectRecord: function() {
      if (this.get('canHaveActionControls'))
        this.toggleProperty('isSelected');
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


    cancelRecord: function(element) {
      var self = this,
          record = this.get('model'),
          store = record.store,
          application = self.application;

      $('.main_spinner').show();
      application.clearNotifications();

      var newDate = (record.get('dateCanceled')) ? null : moment().format(App.Globals.DATE_STRING);
      record.set('dateCanceled', newDate);

      $.ajax({
        type: 'PUT',
        url: App.getUrl('/purchases/' + record.id),
        data: { purchase: { date_canceled: newDate } }
      }).then(function(data) {
        Ember.run(function() {

          application.notify({ message: 'Record Canceled', type: 'notice' });
          $('.main_spinner').hide();
          if (!isEmpty(newDate))
            element.fadeOut();

        });
      }, function(error) {
        Ember.run(function() {

          console.log(error);
          $('.main_spinner').hide();
          application.notify(error);

        });
      });

      return false;
    },


    starMe: function() {
      var self = this,
          record = this.get('model'),
          store = record.store,
          application = self.application;

      $('.main_spinner').show();
      application.clearNotifications();

      var newStar = (record.get('starred')) ? null : moment().format(App.Globals.DATE_STRING);
      record.set('starred', newStar);

      $.ajax({
        type: 'PUT',
        url: App.getUrl('/purchases/' + record.id),
        data: { purchase: { starred: newStar } }
      }).then(function(data) {
        Ember.run(function() {

          application.notify({ message: 'Star updated', type: 'notice' });
          $('.main_spinner').hide();

        });
      }, function(error) {
        Ember.run(function() {

          console.log(error);
          $('.main_spinner').hide();
          application.notify(error);

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
