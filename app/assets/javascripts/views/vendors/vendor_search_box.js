App.VendorSearchBox = App.SearchBoxView.extend({
  includeAdvanced: false,

  didInsertElement: function() {
    $('input', '.search_form_input').val(this.get('targetObject.metadata.vendSearch'));
  }

})
