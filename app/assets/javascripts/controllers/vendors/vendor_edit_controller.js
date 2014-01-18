App.VendorEditController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, {
  needs: 'application',
  applicationBinding: 'controllers.application',
  domElement: null,


  actions: {

    close: function(){
      this.get('model').rollback();
      return this.send('closeModal');
    },


    startEditing: function() {
      this.set('isEditing', true);
    },


    stopEditing: function() {
      this.set('isEditing', false);
    }
  },


  saveRecordAfter: function() {
    this.set('isEditing', false);
  }
});
