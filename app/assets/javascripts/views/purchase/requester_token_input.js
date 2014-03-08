
App.RequesterTokenInput = App.PersonTokenInput.extend({
  modelName: 'requester',
  classNames: ['lg_input', 'purchase_requester_tokens', 'form-input'],

  updateAccounts: true,

  addToken: function(token) {
    Ember.assert('A token was not provided to add', !!token);

    var modelName = this.get('modelName'),
        model = this.get('targetObject');

    model.set(modelName, token);

    if (this.recipientIsDuplicate()) {
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
  },


  recipientIsDuplicate: function() {
    // Update the recipient only if its the same
    var model = this.get('targetObject'),
        recipient = model.get('recipient'),
        requester = model.get('requester');

    if (isEmpty(recipient))
      return true;

    return ((isEmpty(recipient.id) && recipient.email === requester.email));
  }
});
