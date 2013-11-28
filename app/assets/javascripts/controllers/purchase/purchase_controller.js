App.PurchaseController = Ember.ObjectController.extend(App.MetaDataMixin, {
  needs: 'application',
  applicationBinding: 'controllers.application',

  vendorCount: function() {
    return this.get('vendors.length');
  }.property('vendors.length'),

  vendorString: function() {
    var vendors = this.get('vendors')
    if (vendors)
      return this.get('vendors').map(function(v){ return v._data.name; }).join(', ');
  }.property('vendors'),

  buyerFirstName: function() {
    return this.get('buyer').name.split(' ')[0];
  }.property('buyer'),

  isSelecting: function() {
    return this.get('parentController.isReconciling') || this.get('parentController.isAssigning');
  }.property('parentController.isReconciling', 'parentController.isAssigning'),

  actions: {
    // http://discuss.emberjs.com/t/migrating-from-ember-data-0-13-to-1-0-0-beta-1-my-findings/2368
    deleteRecord: function(dom) {

      if (confirm('This will permanently delete this record.  Okay to delete?')) {
        var record = this.get('model'),
            self = this;

        $('.big_delete_button').addClass('button_down');
        this.application.clearNotifications();

        record.deleteRecord();
        record.save().then(function(){
          if (dom)
            dom.fadeOut();
          self.application.notify({message: 'Record successfully deleted', type: 'notice'});
          self.transitionToRoute('purchases');  // TODO: Should this only happen from edit?

        }, function(error){
          $('.big_delete_button').removeClass('button_down');
          record.rollback();
          self.application.notifyWithJSON(error);
        });
      }

      return false;
    },

    openRecord: function() {
      if (this.get('parentController.isReconciling') == true ||
          this.get('parentController.isAssigning') == true) {

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
          current = this.get('starred'),
          self = this,
          application = self.application;

      this.application.clearNotifications();

      if (Ember.isEmpty(current)) {
        record.set('starred', moment().format(APP_DATE_STRING));
      } else {
        record.set('starred', null);
      }

      record.save().then(function(){
        application.notify({message: 'Star updated', type: 'notice'});
        record.reload();

      }, function() {
        record.rollback();
        application.notify({message: 'Failed to update star', type: 'error'});
      });

      $('.ui-tooltip').remove();
      return false;
    },

    saveRecord: function() {
      var record = this.get('model'),
          self = this;

      this.application.clearNotifications();
      $('.button.bottom_button.green').addClass('button_down');

      record.save().then(function(){
        self.transitionToRoute('purchases');
        self.application.notify({message: 'Record saved', type: 'notice'});

      }, function(error){
        $('.button.bottom_button.green').removeClass('button_down');
        $.each(error.responseJSON, function(key, value){
          self.application.notify({ message: key.capitalize() + ': ' + value, type: 'error' });
        });
      });
    },

    cancelEdit: function() {
      this.application.clearNotifications();
      // Let model catch dirty / clean
      window.history.back();
    }
  }
});
