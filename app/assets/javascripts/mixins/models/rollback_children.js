
App.RollbackChildrenMixin = Ember.Mixin.create({

  rollbackRelationships: [],

  rollbackWithChildren: function() {
    var self = this,
        relationships = this.get('rollbackRelationships') || [];

    relationships.forEach(function(relationship) {
      self.get(relationship).filterBy('isDirty').forEach(function(record) {
        record.rollback();
      });
    });

    this.rollback();
  }

});
