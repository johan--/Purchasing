
App.RequesterTokenInput = App.PersonTokenInput.extend({
  modelName: 'requester',
  classNames: ['lg_input', 'purchase_requester_tokens', 'form-input'],

  updateAccounts: true,

  addToken: function(token) {
    var modelName = this.get('modelName'),
        model = this.get('targetObject');
    model.set(modelName, token);

    // Update the recipient only if its the same
    var recipient = model.get('recipient'),
        requester = model.get('requester');

    if (recipient && isEmpty(recipient.id) && recipient.get('email') === requester.get('email')) {
      model.set('recipient', token);
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
