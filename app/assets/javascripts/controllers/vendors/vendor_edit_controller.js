App.VendorEditController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, {
  needs: 'application',
  applicationBinding: 'controllers.application',
  domElement: null,

  actions: {
    close: function(){

      this.get('model').rollback();
      return this.send('closeModal');
    },
  }
})
