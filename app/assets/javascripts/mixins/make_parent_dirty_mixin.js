
App.MakeParentDirty = Ember.Mixin.create({

  isDirtyObserver: function() {
    var isDirty = this.get('isDirty'),
        parentName = this.get('parentObject'),
        parent = this.get(parentName);

    if (isDirty && parent && !parent.get('isDirty')) {
      parent.send('becomeDirty');
    }

  }.observes('isDirty').on('init')

});
