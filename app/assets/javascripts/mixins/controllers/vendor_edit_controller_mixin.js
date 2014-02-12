
App.VendorEditControllerMixin = Ember.Mixin.create({
  needs: ['application'],
  applicationBinding: 'controllers.application',
  domElement: null,

  actions: {

    close: function(){
      if (this.rollbackIfDirty())
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
      if (!confirm('Warning, there are unsaved changes on this record.  Continue with closing this window and loosing these changes?'))
        return true;

      this.get('model').rollback();
    }

    this.set('isEditing', false);
    return false;
  },


  saveRecordAfter: function() {
    this.set('isEditing', false);
  }
});
