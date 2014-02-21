
App.SearchCheckboxView = Ember.Checkbox.extend({

  didInsertElement: function() {
    var name = this.get('name'),
        target = this.get('parentView.controller');
    this.set('checked', target[name]);
  }

});
