
(function() {

  App.FancyBox = Ember.Object.create({

    url: null,
    rotation: null,

    show: function(model) {
      this.set('url', model.get('attachment_preview_url'));
      this.clearRotation();
      this.fancyOpen();
    },


    clearRotation: function() {
      this.set('rotation', null);
    },


    fancyOpen: function() {

      $.fancybox({
        href: this.get('url'),
        afterLoad: function() {
          $('.fancybox-controls').show();
        },
        beforeClose: function() {
          $('.fancybox-controls').hide();
        }
      });
    },

    rotateImage: function(amount) {
      var base = this.get('rotation');

      amount += base;
      $('.fancybox-opened').rotate(amount);

      this.set('rotation', amount);
    }

  });

})();
