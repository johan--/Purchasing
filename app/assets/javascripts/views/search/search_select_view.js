
App.SearchSelectView = Ember.Select.extend({

  classNames: ['form-control'],

  didInsertElement: function() {
    var name = this.get('name'),
        target = this.get('parentView.controller');
    this.set('value', target[name]);
  }

});
