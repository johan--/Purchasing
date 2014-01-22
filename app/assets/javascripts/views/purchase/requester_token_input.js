
App.RequesterTokenInput = App.PersonTokenInput.extend({
  modelName: 'requester',
  classNames: ['lg_input', 'purchase_requester_tokens', 'form-input'],


  addToken: function(token) {
    var modelName = this.get('modelName');
    this.get('targetObject').set(modelName, token);

    if (Ember.isEmpty(this.get('targetObject.recipient'))) {
      this.get('targetObject').set('recipient', token);
      $('.purchase_recipient_tokens').tokenInput('add', token);
    }
  }
});
