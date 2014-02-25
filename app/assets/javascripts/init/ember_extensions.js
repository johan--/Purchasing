
// This is a fix for the 'You must use Ember.set() to access this property' errors
// Several metadata properties are being stored as objects
Ember.merge = function(original, updates) {
  for (var prop in updates) {
    if (!updates.hasOwnProperty(prop)) { continue; }

    Ember.set(original, prop, updates[prop]);
  }
  return original;
};


// In test mode we don't have time for a fadeOut
Ember.removeDom = function(el) {
  $('.tooltip').remove();

  if (Ember.testing)
    el.remove();
  else
    el.fadeOut();
};

Ember.tryGet = function(obj, test) {
  if (!isEmpty(obj))
    return obj[test];
};


Ember.String.humanize = function(string) {
  var stringArray = Ember.String.underscore(string).replace('_', ' ').split(' ');

  return stringArray.map(function(word) { return word.capitalize(); }).join(' ');
};
