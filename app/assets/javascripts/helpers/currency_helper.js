
Ember.Handlebars.helper('currency', function(number, options) {
  return toCurrency(number);
});

Ember.Handlebars.helper('percent', function(number, options) {
  return '%' + (parseFloat(number) || 0).toFixed(2);
});


// Modified from http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
toCurrency = function(val){
  val = toNumber(val);
  var sign = val < 0 ? "$-" : "$",
      val_rounded = parseInt(Math.abs(val), 10),
      val_string_rounded = val_rounded + "",
      offset = (offset = val_string_rounded.length) > 3 ? offset % 3 : 0;

  return sign +
         (offset ? val_string_rounded.substr(0, offset) + "," : "") +
         val_string_rounded.substr(offset).replace(/(\d{3})(?=\d)/g, "$1" + ",") + "." +
         ((val - val_rounded).toFixed(2).slice(2));
};

toNumber = function(num) {
  if (isEmpty(num))
    return 0;
  else if (typeof(num) == 'number')
    return num;
  else if (num.indexOf('%') > -1)
    return parseFloat((num + '').replace(/\%/g, '')) / 100;
  else
    return parseFloat((num + "").replace(/,+|\$+/g,''));
};

toPercent = function(num) {
  return '%' + (toNumber(num) * 100);
};
