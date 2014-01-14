// Class isn't currently being used because:
// -----------------------------------------
// #1 It requires hacking the jquery datepicker for onSelect, this would be global
// #2 I need to study how Sunspot searches ranges better
// #3 Because of the hacky approach some very unpredictable behavior existed
//    (date pickers not closing, flicker, problem selecting months)

/*
App.DateRangeInput = Ember.TextField.extend({
  classNames: ['daterangepicker', 'md_input', 'date_range'],

  currentValue: null,

  didInsertElement: function() {
    var self = this;

    self.$().datepicker({
      dateFormat: App.Globals.DATE_STRING_DATEBOX,

      beforeShowDay: function(date) {
        var dateField =  self.$().val(),
            dates = self.getDatesFrom(dateField),
            date1 = date2 = null;

        if (!Ember.isEmpty(dates[0]))
          date1 = $.datepicker.parseDate(App.Globals.DATE_STRING_DATEBOX, dates[0]);
        if (!Ember.isEmpty(dates[1]))
          date2 = $.datepicker.parseDate(App.Globals.DATE_STRING_DATEBOX, dates[1]);

        if (date2 < date1 && !Ember.isEmpty(date2))
            date2 = [date1, date1 = date2][0];

        if (date1 && date2) {
          var isHighlighted = date1 && ((date.getTime() == date1.getTime()) || (date2 && date >= date1 && date <= date2));
          return [true, isHighlighted ? "dp-highlight" : ""];
        } else {
          return [true];
        }
      },

      onSelect: function(dateText, inst) {
        var dateField =  self.get('currentValue'),
            dates = self.getDatesFrom(dateField);

        if (Ember.isEmpty(dates[0]) || !Ember.isEmpty(dates[1])) {
          dates[0] = dateText;
          dates[1] = null;
        } else {
          dates[1] = dateText;
        }

        dateString = dates[0] + ((dates[1] != null) ? ' - ' + dates[1] : '');
        self.$().val(dateString);
        self.set('currentValue', dateString);

        $(this).datepicker();
      }
    });
  },

  getDatesFrom: function(dateString) {
    if (dateString == null) {
      date1 = date2 = '';
    } else if (dateString.indexOf(' - ') > -1) {
      var dates = dateString.split(' - '),
          date1 = dates[0],
          date2 = dates[1];
    } else {
      date1 = dateString;
      date2 = '';
    }

    return [date1, date2];
  }

});
*/

/*
// Hack to stop datepicker from hiding
$.datepicker._selectDate =  function(id, dateStr) {
  var onSelect,
      target = $(id),
      inst = this._getInst(target[0]);

  dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
  if (inst.input) {
    inst.input.val(dateStr);
  }
  this._updateAlternate(inst);

  onSelect = this._get(inst, "onSelect");
  if (onSelect) {
    onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
  } else if (inst.input) {
    inst.input.trigger("change"); // fire the change event
  }

  if (inst.inline){
    this._updateDatepicker(inst);
  } else {
    this._updateDatepicker(inst);
    //this._hideDatepicker();
    this._lastInput = inst.input[0];
    if (typeof(inst.input[0]) !== "object") {
      inst.input.focus(); // restore focus
    }
    this._lastInput = null;
  }
}

*/
