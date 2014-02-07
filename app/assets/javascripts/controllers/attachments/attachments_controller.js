
App.AttachmentsController = Ember.ArrayController.extend({
  needs: ['application'],
  applicationBinding: 'controllers.application',
  itemController: 'attachment',

  purType: 'materials',

  isMaterials: function() {
    return this.get('purType') === 'materials';
  }.property('purType'),


  isServices: function() {
    return this.get('purType') === 'services';
  }.property('purType'),


  actions: {

    setType: function(purType) {
      this.set('purType', purType);
    }
  }
});
