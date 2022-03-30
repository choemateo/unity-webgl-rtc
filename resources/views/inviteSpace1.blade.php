@extends('layouts.inviteLayout')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header" id="descrip_txt">Invistation Space</div>

                <div class="card-body">
<!--                    <form method="POST" action="/space_invist" id="space_invist_frm" name="space_invist_frm">-->
                     <form method="POST" action="/space" id="space_invist_frm" name="space_invist_frm">
                        @csrf

                        <div class="form-group row">
                            <label for="spacename" class="col-md-4 col-form-label text-md-right">Invistation Space</label>

                            <div class="col-md-6">
                                <input id="condi" type="hidden" class="form-control" name="condi" value="invite">
                                <input id="spacename" type="text" class="form-control" name="spacename" value="{{ $spacename }}" readonly  required>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="username" class="col-md-4 col-form-label text-md-right">Your Name</label>

                            <div class="col-md-6">
                                <input id="username" type="text" class="form-control @error('username') is-invalid @enderror" name="username" value="" required>

                                @error('username')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row mb-0">
                            <div class="col-md-8 offset-md-4">
                                <button type="button" class="btn btn-primary ml-3" id="login_space">
                                    Login Space
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('page_scripts')
    <script type="text/javascript" src="/js/jquery-3.6.0.min.js"></script>
<script>
  document.getElementById('login_space').addEventListener('click', (e)=>{
      e.preventDefault();

      let spacename = document.querySelector('#spacename').value;
      let username = document.querySelector('#username').value;
      if(username)
      {
          $.ajax({
              headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
              url: "/checkequalspaceuser",
              type: 'POST',
              data: {'username':username,'spacename':spacename},
              async:false,
              dataType: 'json',
              success: function(data, textStatus, jqXHR)
              {
                 if(data.msg=="ok") {

                     if(parseInt(data.flag) == 0){
                         alert("You are online state now! \n so can't invite a room");
                         return;
                     }
                     /*
                     else if(parseInt(data.flag) == 1){
                         //alreay off state but created a room
                     }
                     else if(parseInt(data.flag) == 2){
                         //now sign out before was logined with invite
                         //alert("You must login with URL that got before!");
                         //return;
                     }
                     else if(parseInt(data.flag) == -1){
                        // ok can create a one room
                     }
                     */
                     let felem = document.forms["space_invist_frm"];
                     //origin
                     let f_ac = felem.getAttribute('action');
                     f_ac = f_ac + "/"+spacename;
                     felem.setAttribute('action',f_ac);
                     felem.submit();

                    // document.forms["space_invist_frm"].submit();
                 }
                 else
                     alert("It's an unknown error.");

              },
              error: function(jqXHR, textStatus, errorThrown)
              {
                  alert("ajax error");
              }
          });

      }
      else{
          alert("your name are required");
      }
  });

</script>
@endsection
