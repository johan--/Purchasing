App.ReceivingLinesController = Ember.ArrayController.extend({
  itemController: 'receiving_line',

  lineIds: function() {
    // reduce doesn't work here
    res = [];
    this.forEach(function(line) {
      res.push(line.id);
    });
    return res;
  }.property('@each.id'),



  test: function() {
    console.log('trying...');
    this.children().forEach(function(line){
      console.log(line);
    }); //highlightLineItem();
  }
});
