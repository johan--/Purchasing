
App.ControllerSaveAndDeleteMixin = Ember.Mixin.create({

  actions: {

    saveRecord: function() {
      var record = this.get('model'),
          self = this,
          application = this.application,
          spinner = this.get('spinnerDom') || $();

      application.clearNotifications();

      if (!record) {
        application.notify({ message: 'There was an error reading the record, cannot save.  Please try reloading the page', type: 'error' });
        return;
      }

      spinner.show();

      if (Ember.canInvoke(self, 'saveRecordBefore'))
        self.saveRecordBefore();

      record.save().then(function(payload){
        application.notify({message: 'Record saved', type: 'notice'});
        spinner.hide();

        if (Ember.canInvoke(self, 'saveRecordAfter'))
          self.saveRecordAfter(record, self, null);

      }, function(error){
        application.notify(error, 'error');

        console.log(error);
        spinner.hide();
        if (Ember.canInvoke(self, 'saveRecordAfter'))
          self.saveRecordAfter(record, self, error);
      });

      return false;
    },


    deleteRecord: function(element){
      var self = this,
          application = this.application,
          spinner = this.get('spinnerDom') || $(),
          domElement = element || self.domElement;

      application.clearNotifications();

      if (Ember.canInvoke(self, 'deleteRecordBefore'))
        self.deleteRecordBefore();

      if (confirm('This will permanently delete this record.  Okay to delete?')) {
        var record = this.get('model');

        spinner.show();

        record.deleteRecord();
        record.save().then(function(){
          application.notify({message: 'Record deleted', type: 'notice'});

          if (domElement) {
            console.log(1)
            Ember.removeDom(domElement);
          }
          spinner.hide();
          if (Ember.canInvoke(self, 'deleteRecordAfter'))
            self.deleteRecordAfter(record, self);

        }, function(error){
          record.rollback();
          application.notify(error, 'error');

          console.log(error);
          spinner.hide();
          if (Ember.canInvoke(self, 'deleteRecordAfter'))
            self.deleteRecordAfter(record, self, error);
        });
      }

      return false;
    }
  }
});
