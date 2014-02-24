
App.SearchCheckboxView = Ember.Checkbox.extend({

  didInsertElement: function() {
    var name = this.get('name'),
        controller = this.get('controller');
    this.set('checked', controller[name]);
  }

});
