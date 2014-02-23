
App.RequesterTokenInput = App.PersonTokenInput.extend({
  modelName: 'requester',
  classNames: ['lg_input', 'purchase_requester_tokens', 'form-input'],

  updateAccounts: true,

  addToken: function(token) {
    var modelName = this.get('modelName');
    this.get('targetObject').set(modelName, token);

    // Update the recipient
    if (isEmpty(this.get('targetObject.recipient.id'))) {
      this.get('targetObject').set('recipient', token);
      $('.purchase_recipient_tokens').tokenInput('add', token, true);
    }

    // Only refresh tokens if they need it
    if (!token.id)
      this._refreshToken(token);
  },


  removeToken: function(token) {
    var modelName = this.get('modelName'),
        store = this.get('targetObject.store');

    store.unloadAll('account');

    this.get('targetObject').set(modelName, null);
    this.get('targetObject').set('account', null);
    this.get('targetObject.model').send('becomeDirty');
  }

});
