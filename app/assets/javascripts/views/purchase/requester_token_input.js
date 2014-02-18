
App.RequesterTokenInput = App.PersonTokenInput.extend({
  modelName: 'requester',
  classNames: ['lg_input', 'purchase_requester_tokens', 'form-input'],


  addToken: function(token) {
    var modelName = this.get('modelName');
    this.get('targetObject').set(modelName, token);

    if (isEmpty(this.get('targetObject.recipient'))) {
      this.get('targetObject').set('recipient', token);
      $('.purchase_recipient_tokens').tokenInput('add', token);
    }

    this._getAccountsForRequester(token.id);
  },


  removeToken: function(token) {
    var modelName = this.get('modelName'),
        store = this.get('targetObject.store');

    store.unloadAll('account');

    this.get('targetObject').set(modelName, null);
    this.get('targetObject').set('account', null);
    this.get('targetObject.model').send('becomeDirty');

  },


  _getAccountsForRequester: function(id) {
    Ember.assert('You must send an ID to retrieve accounts for a user', !!id);
    var store = this.get('targetObject.store');

    $.ajax({
      url: App.getUrl('/accounts'),
      method: 'GET',
      data: { user: id }
    }).then(function(data) {
      Ember.run(function() {

        if (data && data.accounts) {
          store.unloadAll(App.Account);
          store.pushPayload('account', data);
        }

      });
    });
  }
});
