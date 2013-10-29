
App.RecipientTokenInput = Ember.TextField.extend({
  classNames: ['lg_input'],

  didInsertElement: function() {
    token = [];
    token.push(this.get('targetObject').get('recipient'));
    this.initTokenInput(token);
  },

  initTokenInput: function(token) {
    if (Ember.isEmpty(token) || Ember.isEmpty(token[0]))
      token = null;
    self = this;
    this.$().tokenInput('/user_tokens.json', {
      crossDomain: false,
      minChars: 4,
      preventDuplicates: true,
      theme: 'large',
      tokenLimit: 1,
      hintText: 'Add a recipient',
      onAdd: function(val) {
        self.addToken(val);
      },
      onDelete: function(val) {
        self.removeToken(val);
      },
      prePopulate: token
    });
  },

  addToken: function(token) {
    this.get('targetObject').set('requester', token);
  },

  removeToken: function(token) {
    this.get('targetObject').set('requester', null);
  }
});
