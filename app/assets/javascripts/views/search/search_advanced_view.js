
App.AdvancedSearchBoxView = Ember.View.extend({
  templateName: 'search/advanced_search_box',
  id: 'advanced_search_box',
  classNames: ['advanced_search_box'],

  purchaseTypes: ['materials', 'services'],

  searchFields: Ember.Object.create(),

  getFields: function() {
    var result = {},
        searchFields = this.get('searchFields');

    for (var key in searchFields) {

      if (searchFields.hasOwnProperty(key)) {
        if (key.indexOf('date') > -1) {

          var dates = searchFields[key];

          if (!isEmpty(dates)) {
            result[key + 'Min'] = dates[0] || '';
            result[key + 'Max'] = dates[1] || '';
          }

        } else {
          result[key] = searchFields[key];
        }
      }
    }

    return result;
  },


  willDestroyElement: function() {
    this.$('.modal').modal('hide');
    this.$('.modal').unbind();
    this._super();
  },


  actions: {

    clearFields: function() {
      var searchFields = this.get('searchFields');

      for (var key in searchFields)
        if (searchFields.hasOwnProperty(key))
          searchFields.set(key, null);
    },


    startAdvancedSearch: function() {
      var params = Ember.merge(this.getFields(), {
        searchPage: 1
      });

      if (this.getAllVals() === 0)
        return;

      this.closeModal();
      this.get('controller').send('startAdvancedSearch', params);
    },


    closeModal: function() {
      this.closeModal();
    }
  },


  closeModal: function() {
    this.$('.modal').modal('hide');
  },


  getAllVals: function() {
    var searchFields = this.get('searchFields'),
        count = 0;

    for (var key in searchFields)
      if (searchFields.hasOwnProperty(key))
        if (!isEmpty(searchFields[key]))
          count += 1;

    return count;
  }

});
