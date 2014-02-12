
App.PersonTokenInput = Ember.TextField.extend({
  controller: 'purchase',
  modelName: null,


  didInsertElement: function() {
    var modelName = this.get('modelName'),
        token = [];
    token.push(this.get('targetObject').get(modelName));
    this.initTokenInput(token);
  },


  initTokenInput: function(token) {
    var modelName = this.get('modelName'),
        self = this;

    if (isEmpty(token) || isEmpty(token[0]))
      token = null;

    this.$().tokenInput(App.Globals.namespace + '/user_tokens.json', {
      crossDomain: false,
      minChars: 4,
      preventDuplicates: true,
      theme: 'large',
      tokenLimit: 1,
      hintText: 'Search for a ' + modelName,
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
    this.get('targetObject').set(modelName, token);
  },


  removeToken: function(token) {
    var modelName = this.get('modelName');
    this.get('targetObject').set(modelName, null);
    this.get('targetObject.model').send('becomeDirty');
  },


  willDestroyElement: function() {
    this.$().tokenInput('destroy');
    $('.token-input-dropdown-large').remove();
  }
});