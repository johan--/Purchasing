
App.AccountNewView = Ember.View.extend({
  templateName: 'purchase/accounts/new_view',

  fund: null,
  org: null,
  acct: null,

  fundIsOkay: Ember.computed('fund', function() { return this.get('fund.length') === 6; }),
  orgIsOkay: Ember.computed('org', function() { return this.get('org.length') === 6; }),
  acctIsOkay: Ember.computed('acct', function() { return this.get('acct.length') === 5; }),
  validNumber: Ember.computed.and('fundIsOkay', 'orgIsOkay', 'acctIsOkay'),
  allNumbers: Ember.computed.collect('fund', 'org', 'acct'),


  didInsertElement: function() {
    var self = this;

    this.$('.modal').on('shown.bs.modal', function(e){
      self.clearNumber();
    });
  },


  willDestroyElement: function() {
    this.$('.modal').modal('hide');
    this.$('.modal').unbind();
    this._super();
  },


  numberString: function() {
    return this.get('allNumbers').join('-');
  }.property('allNumbers'),


  clearNumber: function() {
    this.set('fund', '101000');
    this.set('org', null);
    this.set('acct', null);
  },


  actions: {

    newAccountSave: function() {
      if (this.get('validNumber') !== true)
        return;

      this.$('.modal').modal('hide');
      this.get('controller').send('newAccountSave', this.get('numberString'));
    }
  }
});
