App.TagController = Ember.ObjectController.extend({

  actions: {
    deleteRecord: function(dom) {
      // TODO delete

      if (dom)
        dom.slideUp();

      // TODO: If last record add a blank record
    }
  }

})
