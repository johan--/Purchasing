
App.VendorTokenInput = Ember.TextField.extend({
  classNames: ['lg_input'],

  didInsertElement: function() {
    tokens = this.get('targetObject').get('vendorTokens');
    this.initTokenInput(tokens);
  },

  initTokenInput: function(tokens) {
    if (Ember.isEmpty(tokens) || Ember.isEmpty(tokens[0]))
      tokens = null;
    self = this;

    this.$().tokenInput('/vendor_tokens.json', {
      crossDomain: false,
      minChars: 3,
      preventDuplicates: true,
      hintText: 'Add a vendor',
      onAdd: function(val) {
        // Turn 'Add Record' into a token
        if (val.name.indexOf('Add vendor:') == 0 ) {
          new_val = val.name.replace('Add vendor:', '');
          $(this).tokenInput("remove", {id: val.id});
          $(this).tokenInput("add", {id: val.id, name: new_val});
        }

        self.addToken(val);
      },
      onDelete: function(val) {
        self.removeToken(val);
      },
      tokenValue: 'name',  // Use name so we can create new vendors
      prePopulate: tokens
    });
  },

  addToken: function(token) {
    store = this.get('targetObject').store;
    store.pushPayload('vendor', {vendors: [token]});
  },

  removeToken: function(token) {
    this.get('targetObject').get('vendors').removeObject(token);
  }
});
