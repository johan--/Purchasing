
App.RollbackChildrenMixin = Ember.Mixin.create({

  rollbackRelationships: [],

  rollbackWithChildren: function() {
    var self = this,
        relationships = this.get('rollbackRelationships') || [];

    relationships.forEach(function(relationship) {
      self.get(relationship).filterBy('isDirty').forEach(function(record) {
        if (record.get('isNew'))
          record.deleteRecord();
        else
          record.rollback();
      });
    });

    if (self.get('isNew'))
      self.deleteRecord();
    else
      self.rollback();
  }

});
