/* globals Chart:false, feather:false */

(function (){
  'use strict'

    window.onkeyup = function(e) {
        var lt = $('#dashmenu_h').val();
        var code = e.keyCode || e.which;
        if (code === 13) {
          var sval =  $('#searchbox').val().trim();
          if(sval=='')return;
          var routstr="LoginList";
          if(lt=='loginlist')
              routstr="LoginList";
          else if(lt=='roomlist')
              routstr="RoomList";
          else if(lt=='userlist')
              routstr="UserList";

          window.location.href="/"+routstr+"/"+sval;
        }
    };

  //========== delete logined user ===============//
  $('select.cellst').click(function () {
      var id = $(this).attr('id');
      var val = $(this).val();
      if(val=="del" && parseInt(id) > 0) {
          if(window.confirm("really delete?")){
              $.ajax({
                  headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                  url: "/deleteLoginuser",
                  type: 'POST',
                  data: {'id': parseInt(id)},
                  async:true,
                  dataType: 'json',
                  success: function(data, textStatus, jqXHR)
                  {
                      window.location.href="/LoginList/0";

                  },
                  error: function(jqXHR, textStatus, errorThrown)
                  {
                      window.alert("deleteLoginuser error" + textStatus);
                  }
              });
          }
      }
  })

})()
