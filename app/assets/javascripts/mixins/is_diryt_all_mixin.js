
App.IsDirtyScannerMixin = Ember.Mixin.create({


  scanChildrenForDirt: function(items, fields) {
    var result = false;

    items.filter(function(item){
      var foundNoneBlank;

      fields.forEach(function(field){
        // True for first occurance
        if(!isEmpty(item.get(field)))
          foundNoneBlank = true;
      });

      return foundNoneBlank;

    }).forEach(function(item){
      if (item.get('isDirty') === true)
        result = true;
    });

    return result;
  }
});
