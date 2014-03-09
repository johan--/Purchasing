
(function() {

  App.Session = Ember.Object.create({
    lastRequisitionID: null,

    setRequisition: function(req) {
      if (req)
        this.set('lastRequisitionID', req.get('id'));
    }
  });

})();
