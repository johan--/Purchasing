
// Add tooltip removal to views
Ember.View.reopen({
  willDestroyElement: function() {
    if (this.$()) {
      // Attempt to remove tooltips
      if (this.$().tooltip)
        this.$().tooltip('destroy');

      // Attempt to unbind anything remaining
      if (this.$())
        this.$().find('*').andSelf().unbind();
    }

    // Remove any hanging tooltips (this will happen with bootstrap elements)
    $('.tooltip').remove();
  }
});
