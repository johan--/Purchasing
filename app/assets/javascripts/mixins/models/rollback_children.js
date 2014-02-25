
App.RollbackChildrenMixin = Ember.Mixin.create({

  rollbackRelationships: [],

  rollbackWithChildren: function() {
    var self = this,
        relationships = this.get('rollbackRelationships') || [];

    relationships.forEach(function(relationship) {
      self.get(relationship).filterBy('isDirty').forEach(function(record) {
        if (record.id)
          record.rollback();
        else
          record.destroyRecord();
      });
    });

    if (this.id)
      this.rollback();
    else
      this.destroyRecord();
  }

});
