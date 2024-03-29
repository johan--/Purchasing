
App.VendorEditControllerMixin = Ember.Mixin.create({
  needs: ['application'],
  applicationBinding: 'controllers.application',
  domElement: null,

  canNotDelete: Ember.computed.notEmpty('num_purchases'),

  actions: {

    close: function() {
      if (!this.get('isEditing'))
        this.get('model').rollback();

      else if (this.rollbackIfDirty())
        return;

      return this.send('closeModal');
    },


    startEditing: function() {
      this.set('isEditing', true);
    },


    stopEditing: function() {
      if (this.rollbackIfDirty())
        return;
    }
  },


  rollbackIfDirty: function () {
    if (this.get('model.isDirty')) {
      if (!confirm('Warning, there are unsaved changes on this record.  Continue with closing this window and losing these changes?'))
        return true;

      this.get('model').rollback();
    }

    this.set('isEditing', false);
    return false;
  },


  saveRecordAfter: function(record, self, error) {
    if (!error)
      this.set('isEditing', false);
  },


  deleteRecordAfter: function(record, self, error) {
    this.send('closeModal');
  }
});
