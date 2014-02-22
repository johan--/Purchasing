
var attr = DS.attr;

App.CannedMessage = DS.Model.extend({

  name: attr(),
  subject: attr(),
  text: attr(),
  note_text: attr(),
  default_to: attr(),
  default_cc: attr(),

  isEditing: false

});
