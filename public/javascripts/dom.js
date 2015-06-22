$(document).ready(function(){

  var allCheckboxes = $(':checkbox');
  var checkAllIcon = $('.select-all-emails').children(':first');
  var allStars = $('i.star');
  var markAsRead = $('.mark-as-read');
  var markAsUnread = $('.mark-as-unread');
  var deleteEmails = $('.delete-selected-emails');

  if(sessionStorage.length > 0){
    for (var j = 0; j < allCheckboxes.length; j++) {
      if(sessionStorage.getItem('selectedEmail-'+j) === 'false') {
        $(':checkbox:nth-child('+j+')').checked = false;
      } else {
        $(':checkbox:nth-child('+j+')').checked = true;
      }
    }
    console.log(sessionStorage);
  }

  for (var i = 0; i < allCheckboxes.length; i++) {
    $(':checkbox').change(function(){
      sessionStorage.setItem('selectedEmail-'+i, this.checked)
    });
    console.log(sessionStorage);
  }

  // if (sessionStorage.getItem('selectedEmails')){
  //   if (sessionStorage.getItem('selectedEmails') === 'false'){
  //     $(':checkbox')[0].checked = false;
  //   } else {
  //     $(':checkbox')[0].checked = true;
  //
  //   }
  // }
  // $(':checkbox:first').change(function(){
  //   sessionStorage.setItem('selectedEmails', this.checked)
  //   console.log(sessionStorage);
  // });



  $('.select-all-emails').click(function(){
    //if the box is checked, change it to unchecked and uncheck all checkboxes.  Disable menu buttons
    if (checkAllIcon.hasClass('fa-check-square-o')){
      checkAllIcon.removeClass('fa-check-square-o');
      checkAllIcon.addClass('fa-square-o');
      allCheckboxes.each(function(e){
        allCheckboxes[e].checked = false;
        allCheckboxes.parents('tr').removeClass('checked');
      });
      $('.mark-as-read, .mark-as-unread, .delete-selected-emails').attr('disabled', 'disabled');
    //if the box is unchecked, change it to checked and check all checkboxes
    } else if (checkAllIcon.hasClass('fa-square-o')){
      checkAllIcon.removeClass('fa-square-o');
      checkAllIcon.addClass('fa-check-square-o');
      allCheckboxes.each(function(e){
        allCheckboxes[e].checked = true;
        allCheckboxes.parents('tr').addClass('checked');
      });
      $('.mark-as-read, .mark-as-unread, .delete-selected-emails').removeAttr('disabled');
    //if the box is half checked, change it to checked and check all checkboxes
    } else {
      checkAllIcon.removeClass('fa-minus-square-o');
      checkAllIcon.addClass('fa-square-o');
      allCheckboxes.each(function(e){
        allCheckboxes[e].checked = false;
        allCheckboxes.parents('tr').removeClass('checked');
      });
    }
  });

  allCheckboxes.each(function(e,i){
    $(this).click(function(){
      $(this).parents('tr').toggleClass('checked')
      //if any emails are checked, check all is changed to half checked and menu items are enabled
      if ( $(':checked').length > 0 ){
        checkAllIcon.removeClass('fa-check-square-o, fa-square-o');
        checkAllIcon.addClass('fa-minus-square-o');
        $('.mark-as-read, .mark-as-unread, .delete-selected-emails').removeAttr('disabled');
      //if no emails are checked, check all icon is changed to empty and menu items are disabled
      } else {
        checkAllIcon.addClass('fa-check-square-o, fa-square-o');
        checkAllIcon.removeClass('fa-minus-square-o');
        $('.mark-as-read, .mark-as-unread, .delete-selected-emails').attr('disabled', 'disabled');
      }
    });
  });

  allStars.each(function(e){
    $(this).click(function(){
      var id = $(this).parents('tr').children('td:first').children('div').attr('name');
      $(this).toggleClass('fa-star-o');
      $(this).toggleClass('fa-star');
      if ($(this).hasClass('fa-star')) {
        var data = {"starred": true};
      } else {
        var data = {"starred": false};
      }
      var xhr = new XMLHttpRequest;
      xhr.open('post', '/inbox/'+id, true)
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send(JSON.stringify(data));
    });
  });

  markAsRead.click(function(){
    var selected = $(':checked');
    selected.each(function(e){
      var id = $(this).parents('tr').children('td:first').children('div').attr('name');
      var count = $('.unread-count');
      count.html(Number(count.html()) - 1);
      $(this).parents('tr').removeClass('unread');
      $(this).parents('tr').addClass('read');
      var data = {"read": true};
      var xhr = new XMLHttpRequest;
      xhr.open('post', '/inbox/'+id, true)
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.send(JSON.stringify(data));
    });
  });

  markAsUnread.click(function(){
    var selected = $(':checked');
    selected.each(function(e){
      var id = $(this).parents('tr').children('td:first').children('div').attr('name');
      var count = $('.unread-count');
      count.html(Number(count.html()) + 1);
      $(this).parents('tr').removeClass('read');
      $(this).parents('tr').addClass('unread');
      var data = {"read": false};
      var xhr = new XMLHttpRequest;
      xhr.open('post', '/inbox/'+id, true)
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.send(JSON.stringify(data));
    });
  });

  deleteEmails.click(function(){
    var selected = $(':checked');
    selected.each(function(e){
      var id = $(this).parents('tr').children('td:first').children('div').attr('name');
      var xhr = new XMLHttpRequest;
      xhr.open('post', '/inbox/'+id+'/delete', true)
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.send();
      $(this).parents('tr').remove();
      $('.mark-as-read, .mark-as-unread, .delete-selected-emails').attr('disabled', 'disabled');
    });
  });

});
