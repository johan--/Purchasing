
App.VendorTokenInput = Ember.TextField.extend({
  classNames: ['lg_input'],


  didInsertElement: function() {
    tokens = this.get('targetObject').get('vendorTokens');
    this.initTokenInput(tokens);
  },


  initTokenInput: function(tokens) {
    var self = this;

    if (isEmpty(tokens) || isEmpty(tokens[0])) {
      tokens = null;
    }

    this.$().tokenInput(App.Globals.namespace + '/vendor_tokens.json', {
      crossDomain: false,
      minChars: 3,
      preventDuplicates: true,
      hintText: 'Start typing a vendor name to lookup',
      onAdd: function(val) {
        // Turn 'Add Record' into a token
        if (val.name.indexOf('Add vendor:') === 0 ) {
          new_val = val.name.replace('Add vendor:', '');
          $(this).tokenInput("remove", {id: val.id});
          $(this).tokenInput("add", {id: val.id, name: new_val});
        }

        self.addToken(val);
      },
      onDelete: function(val) {
        self.removeToken(val);
      },
      onItemClick: function(val) {
        self.openRelatedVendor(val);
      },
      tokenValue: 'name',  // Use name so we can create new vendors
      prePopulate: tokens
    });
  },


  addToken: function(token) {
    var controller = this.get('targetObject.vendors'),
        parentModel = this.get('targetObject.model'),
        newRec = controller.store.findOrCreate('vendor', token);

    controller.pushObject(newRec);
    parentModel.send('becomeDirty');
    // TODO: error detection
  },


  removeToken: function(token) {
    var controller = this.get('targetObject.vendors'),
        parentModel = this.get('targetObject.model');

    var record = controller.filter(function(oneRecord){
      if (oneRecord.id == token.id) {
        return true;
      }
    }).get('firstObject');

    controller.removeObject(record);
    parentModel.send('becomeDirty');
    // TODO: Error detection
  },


  openRelatedVendor: function(vendor) {
    var controller = this.get('targetObject'),
        record = controller.store.find('vendor', vendor.id);

    controller.send('openModal', 'VendorEdit', 'vendors/form', record);
  },


  willDestroyElement: function() {
    this.$('.token-input-dropdown').remove();
    this.$('.token-input-dropdown-large').remove();
  },


  vendorObserver: function() {
    var self = this,
        vendors = this.get('targetObject.vendors');

    if (this.$().tokenInput) {
      self.$().tokenInput('clear', true);

      if (vendors)
        return vendors.forEach(function(vendor){
          self.$().tokenInput('add', { id: vendor.id, name: vendor.get('name') }, true);
        });
    }
  }.observes('targetObject.vendors.@each')

});
