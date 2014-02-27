
App.VendorNewController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin,
                                                         App.VendorEditControllerMixin, {

  isEditing: true,

  actions: {

    close: function() {
      if (this.rollbackIfDirty())
        return;

      // Force controller back into isEditing state for next time we use it
      this.set('isEditing', true);
      return this.send('closeModal');
    }
  }
});
