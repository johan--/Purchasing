
App.VendorEditController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin,
                                                         App.VendorEditControllerMixin, {

  isEditing: false,

  deleteRecordAfter: function(record, self, error) {
    this.send('closeModal');
  }
});
