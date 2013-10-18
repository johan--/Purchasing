search_results = (function(){

  $(function() {

    $(document).on('click', '.search_result', function(){
      id = $(this).attr('id');
      if (id != null)
        $.get('/purchases/' + id + '/edit', null, null, 'script');
    });

  });

})();