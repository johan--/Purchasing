
App.RequesterTokenInput = Ember.TextField.extend({
  classNames: ['lg_input'],
  modelName: 'requester',
  controller: 'purchase',
  id: 'purchase_requester_tokens',

  didInsertElement: function() {
    var modelName = this.get('modelName'),
        token = [];
    token.push(this.get('targetObject').get(modelName));
    this.initTokenInput(token);
  },

  initTokenInput: function(token) {
    var modelName = this.get('modelName'),
        self = this;

    if (Ember.isEmpty(token) || Ember.isEmpty(token[0]))
      token = null;

    this.$().tokenInput('/user_tokens.json', {
      crossDomain: false,
      minChars: 4,
      preventDuplicates: true,
      theme: 'large',
      tokenLimit: 1,
      hintText: 'Add a ' + modelName,
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
    var modelName = this.get('modelName');
    this.get('targetObject').set(this.get('modelName'), token);
  },

  removeToken: function(token) {
    var modelName = this.get('modelName');
    this.get('targetObject').set(this.get('modelName').null);
  }
});
