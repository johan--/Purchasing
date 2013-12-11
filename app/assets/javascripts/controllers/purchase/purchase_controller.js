App.PurchaseController = Ember.ObjectController.extend(App.MetaDataMixin, App.ControllerSaveAndDeleteMixin, {
  needs: 'application',
  applicationBinding: 'controllers.application',


  vendorCount: function() {
    return this.get('vendors.length');
  }.property('vendors.length'),


  buyerInitials: function() {
    var buyer = this.get('buyer'),
        res = '';

    if (!Ember.isEmpty(buyer)) {
      var buyerArray = buyer.name.split(' ');

      for(i = 0; i < buyerArray.length; i++)
        res += buyerArray[i][0].toUpperCase();
    }

    return res;
  }.property('buyer'),


  actions: {
    openRecord: function() {
      if (this.get('parentController.isReconciling') === true ||
          this.get('parentController.isAssigning') === true) {

        this.set('isSelected', !this.get('isSelected'));

      } else {

        this.application.clearNotifications();
        var record = this.get('model');
        this.transitionToRoute('purchase.edit', record );
        return false;
      }
    },


    starMe: function() {
      var record = this.get('model'),
          self = this,
          application = self.application;

      this.application.clearNotifications();
      $('.purchase_spinner').show();

      $.post('/purchases/' + record.id + '/toggle_starred').then(function(data) {
        application.notify({ message: 'Star updated', type: 'notice' });
        record.reload();
        $('.main_spinner').hide();

      }, function(error) {
        $('.main_spinner').hide();
        application.notify({ message: 'Failed to update Star: ' + error.responseText, type: 'error' });
      });

      $('.ui-tooltip').remove();
      return false;
    },


    cancelEdit: function() {
      this.application.clearNotifications();
      // Let model catch dirty / clean
      window.history.back();
    }
  },


  saveRecordBefore: function() {
    $('.button.bottom_button.green').addClass('button_down');
  },


  saveRecordAfter: function(record, self) {
    $('.button.bottom_button.green').removeClass('button_down');
    self.transitionToRoute('purchases');
  },


  deleteRecordBefore: function() {
    $('.big_delete_button').addClass('button_down');
  },


  deleteRecordAfter: function(record, error, self) {
    $('.big_delete_button').removeClass('button_down');
  },
});
