
App.IsDirtyScannerMixin = Ember.Mixin.create({


  scanChildrenForDirt: function(records, fields) {
    var result = false;

    // First filter out any blank records
    records.filter(function(item){
      var foundNoneBlank;

      fields.forEach(function(field){
        // True for first occurance
        if(!Ember.isEmpty(item.get(field)))
          foundNoneBlank = true;
      });

      return foundNoneBlank;

    // Scan found records for isDirty
    }).forEach(function(record){
      if (record.get('isDirty') === true)
        result = true;
    });

    return result;
  }
});
