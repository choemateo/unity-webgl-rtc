@extends('layouts.app')
@section('pagestyle')
    <style>
    </style>
@endsection
@section('scripts')
    <script type="text/javascript" src="/js/jquery-3.6.0.min.js"></script>
@endsection
@section('content')
<div class="container">
    <div class="row justify-content-center h-100">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header" id="descrip_txt">Invistation Space</div>
                <div class="card-body" style="padding-top: 0.5rem;color: #fff">
                     <form method="POST" action="/space" id="space_invist_frm" name="space_invist_frm">
                        @csrf

                        <div class="form-group form-group-normal">
                            <label for="spacename" class="col-md-12 text-md-left">Invistation Space</label>

                            <div class="col-md-12">
                                <input id="condi" type="hidden" class="form-control" name="condi" value="invite">
                                <input id="spacename" type="text" class="form-control" name="spacename" value="{{ $spacename }}" readonly  required>
                            </div>
                        </div>

                        <div class="form-group form-group-normal">
                            <label for="username" class="col-md-12 text-md-left">Your ID</label>

                            <div class="col-md-12">
                                <input id="username" type="text" class="form-control @error('username') is-invalid @enderror" name="username" value="" required>

                                @error('username')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                         <div class="form-group form-group-alert">
                             <div class="common_modal">
                                 <p class="txt_alert">
<!--                                     다른 곳에서 로그인 중 입니다. 로그인을 계속 진행 할까요? (다른 곳은 로그아웃됩니다.)-->
                                     You are logging in from another place.
                                     Do you want to proceed with logging in?
                                     (Other places will log you out.)
                                 </p>
                                 <div class="box_btn">
                                     <button type="button" class="btn_cancel" data-modalclose="true">Cancel</button>
                                     <button type="button" class="btn_confirm">Ok</button>
                                 </div>
                             </div>
                         </div>

                        <div class="form-group mb-0 mt-md-4">
                            <div class="col-md-12 d-flex justify-content-center">
                                <button type="button" class="btn btn-primary" id="login_space">
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
<script>
    $(document).ready(function () {
        $('#login_space').click(function (e){
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

                            if(parseInt(data.flag) == 0 || parseInt(data.flag) == 3)
                            {
                               $('.form-group.form-group-normal').css('display','none');
                               $('.form-group.form-group-alert').css('display','block');
                                return;
                            }
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
        $('.form-group-alert .btn_confirm').click(function (e) {
            e.preventDefault();
            let username = document.querySelector('#username').value;
            let spacename = document.querySelector('#spacename').value;
            if(username)
            {
                $.ajax({
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    url: "/leavePlayUserInfo",
                    type: 'POST',
                    data: {'username':username,'spacename':spacename},
                    async:false,
                    dataType: 'json',
                    success: function(data, textStatus, jqXHR)
                    {
                        if(data.msg=="ok")
                        {
                            $('.form-group.form-group-normal').css('display','block');
                            $('.form-group.form-group-alert').css('display','none');
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
        $('.form-group-alert .btn_cancel').click(function (e) {
            e.preventDefault();
            $('.form-group.form-group-normal').css('display','block');
            $('.form-group.form-group-alert').css('display','none');
        })
    });
</script>
@endsection
