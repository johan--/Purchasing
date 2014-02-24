
App.SearchSelectView = Ember.Select.extend({

  classNames: ['form-control'],

  didInsertElement: function() {
    var name = this.get('name'),
        controller = this.get('controller');
    this.set('value', controller[name]);
  }

});
