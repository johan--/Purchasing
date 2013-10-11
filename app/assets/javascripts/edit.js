edit = (function(){
  $(function() {

    receiving_mode = false;

    // Focus for line_items
    $(document).on('focusout', '.description_field, .price_field, .note_field', function(e) {
      if ( $(this).val().length > 0 ) {
        row = $(this).parent();
        if (!row.is(':last-child') && row.parent().children().length > 1)
          return;
        add_row_to(row.attr('class'));
      }
    });
    $(document).on('focusout', '.price_field', function() {
      $(this).toNumber().formatCurrency();
    });
    $(document).on('focusout', '.price_field, .quantity_field', function() {
      update_extended_cost();
    });
    

    // Delete button (all)
    $(document).on('click', '.delete', function(e) {
      row = $(this).parent();
      class_name = $(this).attr('class');

      $(this).prev("input").val('true');
      row.slideUp( function(e) { number_lines($(this).parent()); });

      // Only run on edit layout
      if ( $('.edit_box').length > 0 )
        if ( row.parent().children().length < 2 )
          add_row_to(class_name);
    });
    
    $(document).on('click', '.add_plus', function() {
      add_row_to(this.id);
    });

    // Start new receiving doc
    $(document).on('click', '.receiving_button', function(e) {
      if (receiving_mode)
        stop_receiving();
      else
        start_receiving();
    });

    // Receive all
    $(document).on('click', '.receive_all_button', function(e) {
      receive_all_items();
    });

    // Edit a record
    $(document).on('click', '.receiving_rec', function(e) {
      start_receiving($(this));
    });

    // Hover received
    $(document).on('mouseover', '.receiving_rec', function(e) {
      color_line_items($(this));
    });
    $(document).on('mouseout', '.receiving_rec', function(e) {
      clear_line_colors();
    });

    // Timers for receiving increment
    var pressTimer = null;
    var pressStart = null;
    
    // Receiving + / - buttons
    $(document).on('mousedown', '.receiving_left, .receiving_right', function() {
      console.log('down');
      pressStart = new Date();
      direction = $(this).attr('class')=='receiving_left' ? -1 : 1;
      obj = $(this);
      pressTimer = setInterval(function(){ increment_plus(direction, obj); }, 600);
    });
    $(document).on('mouseup', '.receiving_left, .receiving_right', function() {
      clearInterval(pressTimer);
      current_time = new Date();
      if (current_time - pressStart < 500) {
        direction = $(this).attr('class')=='receiving_left' ? -1 : 1;
        receive_plus(direction, $(this));
      }
      pressStart = null;
    });
    function increment_plus(direction, obj) {
      receive_plus(direction*10, obj);
    }

    // Add Tag click
    $(document).on('change', '.add_tag_list', function() {
      tag_name = $('.add_tag_list option:selected').text();
      tag_id = $('.add_tag_list option:selected').val();
      reset_tag_selector();

      if ($('.tags input[value=' + tag_id + '][class="tag_id"]').length > 0) {
        alert("Error: You already have used that tag");
        return;
      }
      
      new_div = get_div_from_data($('.new_tag'), "new_purchase_to_tags", $('.tags'));
      if (new_div == null)
        return;
      $('.tag_name', new_div).text(tag_name);
      $('.tag_id', new_div).val(tag_id);
      new_div.hide().fadeIn();
    });

    // Account field
    $(document).on('change', '#purchase_account_id', function(){ 
      if ( $(this).val() == 'New Account') {
        $('.new_account_fields').removeClass('hidden');
        $('#purchase_account_id').addClass('hidden');
         $('.new_org_field').val('');
         $('.new_acct_field').val('');
        $('.new_account_fields').slideDown();
      }
    });
    $(document).on('click', '#new_account_save', function(){
      separator = "-";
      new_account = $('.new_fund_field').val() + separator + $('.new_org_field').val() + separator + $('.new_acct_field').val();
      user_id = $('.account').data('user');
      $('.new_account_loading').removeClass('hidden');
      $.post('/account/new?user=' + user_id + '&account=' + new_account, null, null, 'script');
    });
    
    $(document.on('click', '#new_account_cancel', function(){
    
    });
  });

  function reset_tag_selector(){
    $('.add_tag_list option:first-child').attr('selected', true);
  }

  function init() {
    // Date Picker
    $( ".datepicker" ).datepicker({ dateFormat: 'M d, yy' });

    // Init new rows
    add_row_to('line_item');
    add_row_to('note');

    // Receiving
    receiving_mode = false;

    // Extended
    update_extended_cost();

    $('#purchase_vendor_tokens').tokenInput('/vendor_tokens.json', { 
      crossDomain: false,
      minChars: 3,
      preventDuplicates: true,
      hintText: 'Add a vendor',
      onAdd: function(val) { 
        if (val.name.indexOf('Add vendor:') == 0 ) {
          new_val = val.name.replace('Add vendor:', '');
          $(this).tokenInput("remove", {id: val.id});
          $(this).tokenInput("add", {id: val.id, name: new_val});
        }
      },
      tokenValue: 'name',  // Use name so we can create new vendors
      prePopulate: $('#purchase_vendor_tokens').data('pre')
    });

    $('#purchase_requester_tokens').tokenInput('/requester_tokens.json', { 
      crossDomain: false,
      prePopulate: $('#purchase_requester_tokens').data('pre'),
      hintText: 'Add a requester',
      minChars: 4,
      preventDuplicates: true,
      theme: 'large',
      tokenLimit: 1
    });
  }

  function update_extended_cost() {
    $('.line_items').children().each(function(){
      quantity = $('.quantity_field', $(this)).val();
      price = $('.price_field', $(this)).asNumber();
      $('.extended_field', $(this)).text( quantity * price ).formatCurrency();
    });
  }

  function add_row_to(old) {
    new_class = ".new_" + old;
    parent = $("." + old + "s")
    
    new_div = get_div_from_data($(new_class), "new_" + old + "s", parent);
    if (new_div == null)
      return;
    new_div.hide().slideDown('fast');
    
    number_lines(parent);
  }

  function number_lines() {
    var t = 1;
    $('.line_items').children().each( function() {
      if ( $(this).css('display') != 'none' )
        $('.line_number', this).text( t++ );
    });
  }

  // Build new div from data attribute
  function get_div_from_data(data_element, regexp, doc) {
    new_id = new Date().getTime();
    data = data_element.data('new');
    if (data==null)
      return null;

    regexp = new RegExp(regexp, "g");
    content = data.replace(regexp, new_id);

    new_div = $(content).attr('id', '' + new_id);
    doc.append(new_div);

    return new_div;
  }

  function start_receiving(receiving_doc) {
    // Do we have permission to edit or create a receiving document?
   
    // If 'record' is null, then we are starting a new record
    if (receiving_doc == null) {
      receiving_doc = build_new_receiving_doc();
      if (receiving_doc == null)
        return;
    }

    // Save current receiving document to proxy
    build_proxy_fields(receiving_doc, true);  

    // Freeze receiving list hover
    receiving_mode = true;

    // Button down ... or remove??
    $('.receiving_button').text("Stop Receiving");
    
    // Add buttons to line_items
    $('.proxy_field_header').removeClass('hidden');
    $('.unit_field, .quantity_field').addClass('hidden')
    $('.proxy_field, .receiving_left, .receiving_right', '.line_items').removeClass('hidden');
    $('.proxy_field').removeClass('proxy_padding');
  }

  function receive_all_items() {
    // !!! This will not save any changes to current receiving docs
    id = $('.edit_box').attr('id');
    if (id!=null)
      $.post('/purchases/' + id + '/receive_all', null, null, 'script');
  }

  // Loops through all rec_docs to count the number received for cur_line
  function count_receivings_for(cur_line) {
    cur_id = cur_line.attr('id');
    total = 0;

    $('.receiving_rec', '.receiving_docs').each( function(){
      rec_lines = $('.receiving_lines', $(this));

      rec_lines.children().each( function(){
        this_line = $('.line_id', $(this));
        if ( this_line.val() == cur_id )
          total += parseInt( $('.quantity', $(this)).val() );
      });
    });
 
    return total;
  }

  function stop_receiving() {
    $('.unit_field, .quantity_field').removeClass('hidden')
    $('.proxy_field, .receiving_left, .receiving_right', '.line_items').addClass('hidden');
    $('.proxy_field').text('').attr('data-rec-quantity','').attr('data-rec-parent-id','').attr('data-rec-id','')
    $('.receiving_button').text("Start Receiving");
    receiving_mode = false;
  }

  // Create a new receiving doc
  function build_new_receiving_doc() {
    data_cell = $('.new_receiving_item');
    docs = $('.receiving_docs');
    new_div = get_div_from_data(data_cell, 'new_receivings', docs);
    if (new_div == null)
      return null;

    data_cell.remove(); // We aren't going to need it again

    $('.receiving_created', new_div).text('--Right Now--');
    return new_div;
  }

  // Create a new receiving line
  function build_new_receiving_line(line_item, parent_id) {
    // What should this do if the parent is bad?

    parent = $('#' + parent_id, '.receiving_docs');
    new_div = get_div_from_data($('.new_receiving_line', parent), 'new_receiving_lines', $('.receiving_lines', parent) );
    if (new_div == null)
      return null;

    // Save new line item id
    line_item_id = parseInt(line_item.attr('id'));

    $('.line_id', new_div).val(line_item_id);
    // Init quantity
    $('.quantity', new_div).val(0);

    return new_div;
  }

  // Copies current quantity fields to proxy field
  function copy_text_to_proxy() {
    $('.proxy_field').each( function(){
      amount = $(this).siblings('.quantity_field').val();
      $(this).text(amount);
      $(this).data('val', amount);
    });
  }

  // Build the proxy field quantities
  function build_proxy_fields(receiving_doc, copy_rec_flag) {
    copy_rec_flag = copy_rec_flag || false;
    copy_text_to_proxy();

    $('.receiving_lines', receiving_doc).children().each( function(e) {
      line_id = $('.line_id', $(this)).val();
      
      if (line_id != null && line_id != '') {
        line_item = $('#' + line_id)
        total_received = count_receivings_for( $('#' + line_id, $('.line_items') ) ); 
        received = $('.quantity', $(this)).val();
        set_proxy_with( $('.proxy_field', line_item), received, total_received);
      }

      // Copy receiving data to proxy data attr's
      if (copy_rec_flag) {
        copy_receiving_data(receiving_doc, $(this), line_item);
      } else {
        $(line_item).addClass('line_highlighted');
      }
    });
  }

  // Copy the receiving data from a receiving line to the line item proxy
  function copy_receiving_data(receiving_doc, rec_line, line_item) {
    // Use attr instead of id val to capture new record
    parent_id = receiving_doc.attr('id'); 
    id = rec_line.attr('id');

    line_id = $('.line_id', rec_line).val();
    quantity = $('.quantity', rec_line).val();

    // Save parent ID to all line items
    $('.proxy_field').attr('data-rec-parent-id', parent_id);

    // Save the receiving line if we have any yet
    if (id!=null) {
      proxy_field = $('.proxy_field', line_item);  // TODO This is returning line_item
      proxy_field.attr('data-rec-id', id);
      proxy_field.attr('data-rec-quantity', quantity);
    }
  }
  
  // Add item to current receciving doc
  function receive_plus(mod, obj) {
    proxy = obj.siblings('.proxy_field');
    parent = obj.parent();
    cur = parseInt(proxy.attr('data-rec-quantity')) || 0;
    so_far = count_receivings_for(parent);
    max = parseInt(obj.siblings('.quantity_field').val()) || 0;
    
    // TODO: Add an override or warning for this?
    if (mod + so_far >= max) {
      cur += max - so_far;
      parent.addClass('received_full');
    } else if (mod + so_far < 0) {
      cur = 0;
    } else {
      cur += mod;
    }

    set_proxy_with(proxy, cur, mod + so_far);
    update_receiving_line(proxy, cur);
  }

  // Set proxy text with received / ordered:  5 (10) / 15
  function set_proxy_with(proxy, cur, total) {
    total = total || 0;
    ordered = proxy.siblings('.quantity_field').val();
    text = cur + ' (' + total + ') / ' + ordered;
    proxy.attr('data-rec-quantity', cur).text(text);
  }

  // Update receiving line after proxy has been modified
  function update_receiving_line(proxy, new_amount) {
    cur_id = proxy.attr('data-rec-id');
    parent_id = proxy.attr('data-rec-parent-id');

    // If either id is bad, initialize a new receiving line
    if (cur_id == null || parent_id == null) {
      cur_id = build_new_receiving_line(proxy.parent(), parent_id).attr('id');
      if (cur_id == null)
        return;
      proxy.attr('data-rec-id', cur_id);
    }

    // Update rec line
    parent = $('#' + parent_id, '.receiving_docs');
    $('#' + cur_id, parent).children('.quantity').val(new_amount);
    
    // Update highlighting
    proxy.parent().addClass('line_highlighted');

    // Update parent total
    update_parent_total(parent);
  }

  // Get total count for rec
  function update_parent_total(parent) {
    total = 0;

    $('.receiving_lines', parent).children().each( function(){
      count = parseInt($('.quantity', $(this)).val());
      if (count!=null && !isNaN(count))
        total += count;
    });

    $('.receiving_total', parent).text(total);
  }

  // Hover effect for receiving docs
  function color_line_items(doc) {
    if ( receiving_mode )
      return;

    $('.line_item').removeClass('line_highlighted');
    $('.unit_field, .quantity_field').addClass('hidden');
    $('.proxy_field').removeClass('hidden').addClass('proxy_padding');
    
    build_proxy_fields(doc);    
  }

  // Clear all highlights
  function clear_line_colors() {
    if ( receiving_mode )
      return;
    $('.proxy_field').addClass('hidden');
    $('.unit_field, .quantity_field').removeClass('hidden');
    $('.line_item').removeClass('line_highlighted');
  }

  return {
    number_lines: function(){ number_lines(); },
    init: function(){ init(); }
  }
})();