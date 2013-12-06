App.VendorsController = Ember.ArrayController.extend(App.MetaDataMixin, {
  itemController: 'vendor',
  needs: 'application',


  getAllLetters: function() {
    return 'All A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.w();
  }.property(),


  currentLetter: function() {
    return this.get('metadata').letter;
  }.property('metadata'),


  noRecordsFound: function() {
    return this.get('length') === 0;
  }.property('length'),


  actions: {

    newRecord: function() {
      record = this.store.createRecord('vendor');
      this.send('openModal', 'VendorEdit', 'vendors/edit', record);
      return false;
    }
  }
});
