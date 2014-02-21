
App.DateRangeInput = Ember.TextField.extend({

  classNames: ['input-small', 'form-control'],

  didInsertElement: function() {
    var name = this.get('name'),
        value = this.get('parentView').get(name);

    this.$().datepicker('setDate', value);
  }

});
