
App.RequesterTokenInput = Ember.TextField.extend({
  classNames: ['lg_input'],

  didInsertElement: function() {
    token = [];
    token.push(this.get('targetObject').get('requester'));
    this.initTokenInput(token);
  },

  initTokenInput: function(token) {
    if (token == null || token[0] == null)
      token = null;
    parent = this;
    this.$().tokenInput('/user_tokens.json', {
      crossDomain: false,
      minChars: 4,
      preventDuplicates: true,
      theme: 'large',
      tokenLimit: 1,
      hintText: 'Add a requester',
      onAdd: function(val) {
        parent.addToken(val);
      },
      onDelete: function(val) {
        parent.removeToken(val);
      },
      prePopulate: token
    });
  },

  addToken: function(token) {
    // TODO: error tracking
    this.get('targetObject').set('requester', token);
  },

  removeToken: function(token) {
    this.get('targetObject').get('requester').removeObject(token);
  }
});
