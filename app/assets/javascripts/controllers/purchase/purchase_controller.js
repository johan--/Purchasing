App.PurchaseController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, {
  needs: 'application',
  applicationBinding: 'controllers.application',

  metadata: function() {
    var metadata = this.get('store').metadataFor('purchase');
    return metadata;
  }.property('model.isLoaded'),


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


  canHaveActionControls: function() {
    var tab = this.get('metadata.tab');
    return tab === 'New' || tab === 'Purchased' || tab === 'Reconciled';
  }.property('metadata'),


  actions: {
    openRecord: function() {
      this.application.clearNotifications();
      var record = this.get('model');
      this.transitionToRoute('purchase.edit', record );
      return false;
    },


    selectRecord: function() {
      this.set('isSelected', !this.get('isSelected'));
    },


    starMe: function() {
      var record = this.get('model'),
          self = this,
          application = self.application;

      this.application.clearNotifications();
      $('.main_spinner').show();

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
  },


  saveRecordAfter: function(record, self, error) {
    this.set('isEditing', null);
  },


  deleteRecordBefore: function() {
  },


  deleteRecordAfter: function(record, self, error) {
  },
});
