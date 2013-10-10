// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery.ui.datepicker
//= require jquery.ui.resizable
//= require jquery.ui.tooltip
//= require jquery_ujs
//= require_tree .



// Modified from Biola CS
$.fn.observe = function( time, callback ){

  return this.each(function(){
 
    var form = $(this), changed = false;
    var last_key = null;
    $('input[type=submit]', form).hide();

    $('input', form).each(function(){
      $(this).on('keyup change', function(){
        elem = $(this);
        
        if ( elem.data('serialized') != elem.serialize() ) {
          last_key = new Date();
          elem.data('serialized', elem.serialize());
          changed = true;
        }
      });
    });

    setInterval(function(){
      cur = new Date();
      if (changed && cur-last_key > time) {
        changed = false;
        callback.call( form );
      }
    }, 500);
  });
};
