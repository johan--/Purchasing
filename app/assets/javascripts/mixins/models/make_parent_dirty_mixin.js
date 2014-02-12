
App.MakeParentDirty = Ember.Mixin.create({

  isDirtyObserver: function() {
    var isDirty = this.get('isDirty'),
        recordName = this.get('parentObject'),
        observeField = this.get('observeField'),
        record = this.get(recordName);

    if (isDirty && record && !record.get('isDirty')) {
      record.send('becomeDirty');
    }
  }.observes('isDirty', 'observeField').on('init')

});
