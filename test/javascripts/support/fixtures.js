
var fixtures = null;

(function() {

fixtures = {
  updateOneFixture: function(model, id, data) {
    Ember.assert('No model name sent to updateOneFixture', !!model);
    Ember.assert('No id sent to updateOneFixture', !!id);
    Ember.assert('No data sent to updateOneFixture', !!id);

    var store = lookups.store(),
        attributes = Ember.merge({ id: id }, data);

    Ember.run(function() {
      // Update sends the _partial flag which forces an update instead of replace
      store.update(model, attributes);
    });
  },

  // This uses a different approach than update one
  updateAllFixtures: function(model, setData) {
    var fixtures = Ember.A(model.FIXTURES),
        store = lookups.store();

    if (Ember.isEmpty(fixtures))
      return;

    Ember.run(function() {
      // Since we're in a run loop we can update the fixture data directly
      fixtures.forEach(function(item){
        Ember.merge(item, setData);
      });
    });
  },

  reset: function() {
    var models = ['Account',
                  'Attachment',
                  'LineItem',
                  'Note',
                  'PurchaseToTag',
                  'Purchase',
                  'ReceivingLine',
                  'Receiving',
                  'Tag',
                  'CannedMessage',
                  'User',
                  'Vendor'],
        store = lookups.store();

    // Use Deep copy so BASE remains intact
    $.each(models, function(index, model){
      App[model].FIXTURES = Ember.copy(App[model].FIXTURES_BASE, true);
    });
    META_FIXTURE = Ember.copy(META_FIXTURE_BASE, true);

    Ember.run(function() {
      App.Session.currentUser.set('roles', ['admin']);
    });
  },


  createLine: function(id, quantity){
    var purId = lookups.currentModel().get('id');

    return this.createObject(id, 'lineItem', { purchase: purId,
                                               description: 'a test line',
                                               quantity: quantity || 5 });
  },


  createReceiving: function(lineItem, count){
    var model = lookups.currentModel(),
        purId = model.get('id'),
        receivingId = getNextIdFrom('receiving'),
        receivingLineId = getNextIdFrom('receivingLine'),
        lineId = (lineItem) ? lineItem.get('id') : null;

    var newReceiving = this.createObject(receivingId,
                                         'receiving',
                                       { purchase: purId,
                                         receivingLines: [receivingLineId],
                                         total: 1 }, true);
    var newReceivingLine = this.createObject(receivingLineId,
                                             'receivingLine',
                                           { quantity: count || 5,
                                             lineItem: lineId,
                                             receiving: receivingId }, true);
    return Ember.run(function() {
      model.get('receivings').pushObject(newReceiving);

      if (lineItem)
        lineItem.get('receivingLines').pushObject(newReceivingLine);

      return newReceiving;
    });
  },


  createVendor: function(id, text){
    var purId = lookups.currentModel().get('id');

    return this.createObject(id, 'vendor', { purchase: purId,
                                             name: text || 'a vendor!' });
  },


  createNote: function(id, text){
    var purId = lookups.currentModel().get('id');

    return this.createObject(id, 'note', { purchase: purId,
                                           text: text || 'a note!' });
  },


  createTag: function(id, text){
    var purId = lookups.currentModel().get('id');

    return this.createObject(id, 'tag', { purchase: purId,
                                          text: text || 'a tag!!' });
  },


  createAttachment: function(id, skipPurchase){
    var purId = (!skipPurchase) ? lookups.currentModel().get('id') : null;

    return this.createObject(id, 'attachment', { purchase: purId, purchase_id_server: purId }, skipPurchase);
  },


  createPurchase: function(id) {
    return this.createObject(id, 'purchase', { dateRequested: '1/1/2014' }, true);
  },


  createObject: function(id, type, attributes, skipAppend) {
    Ember.assert('No type was provided', !!type);
    Ember.assert('Type must be a string', Ember.typeOf(type) !== 'String');

    var store = lookups.store();

    return Ember.run(function() {
      id = id || getNextIdFrom(type);

      var newObject = store.push(type, Ember.merge({ id: id }, attributes || {}));

      if (!skipAppend)
        lookups.currentModel().get(type.pluralize()).pushObject(newObject);

      return newObject;
    });
  }
};


function getNextIdFrom(model){
  var store = lookups.store(),
      length = store.all(model).get('content.length') || 0;
  return length + 1;
}

})();
