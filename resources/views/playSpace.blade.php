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
                <div class="card-header" id="descrip_txt">Your Space</div>
                <div class="card-body" style="padding-top: 0.5rem;color: #fff">
                    <form method="POST" action="/space" id="space_frm" name="space_frm">
                        @csrf

                        <div class="form-group form-group-normal">
                            <label for="spacename" class="col-md-12 text-md-left">Your Space</label>

                            <div class="col-md-12">
                                <input type="hidden" id="condi" name="condi"  value="owner">
                                <input id="spacename" type="text" class="form-control @error('spacename') is-invalid @enderror" name="spacename" value="" required  autofocus>

                                @error('spacename')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group form-group-normal">
                            <label for="username" class="col-md-12 text-md-left">Your ID</label>

                            <div class="col-md-12">
                                <input id="username" type="text" class="form-control @error('username') is-invalid @enderror" name="username" value="{{ $username }}" readonly required>

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
                                    <!-- 다른 곳에서 로그인 중 입니다. 로그인을 계속 진행 할까요? (다른 곳은 로그아웃됩니다.)-->
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
                                <input type="hidden" id="spacelink" name="spacelink"  value="">
                                <!--
                                 <button type="button" class="btn btn-primary" id="create_space">
                                   Create Space
                                </button>-->
                                <button type="button" class="btn btn-primary" id="login_space">
                                    Login Space
                                </button>
                            </div>
                        </div>

                        <div class="form-group mb-0 mt-md-4">
                            <div class="col-md-12 d-flex justify-content-center">
                                <button type="button" class="btn btn-primary" id="log_out">
                                    Log Out
                                </button>
                            </div>
                        </div>

                    </form>
                    <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                        @csrf
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
        function  generateRandomString(){
            return Math.random().toString(36).slice(2).substring(0, 15);
        }
        function createSpace() {
            let spacename = document.querySelector('#spacename').value;
            if (!spacename || !spacename.replace(/ /g, '').length){
                let txt="Please input the your space field.";
                alert(txt);
            }
            else
            {
                spacename = spacename.replace(/ /g, '');
                let spacelink = `${spacename.replace(' ', '_')}_`+generateRandomString();
                document.querySelector('#spacelink').value=spacelink;
                return 1;
            }

            return 0;
        }

        $('#create_space').click(function (e){
            e.preventDefault();
            let spacename = document.querySelector('#spacename').value;
            let username = document.querySelector('#username').value;
            let descrip_txt = document.querySelector("#descrip_txt");

            if (!spacename || !spacename.replace(/ /g, '').length){
                let txt="Please input the your space field.";
                descrip_txt.innerHTML=txt;
                descrip_txt.style.color="#ff082a";
            }
            else{
                spacename = spacename.replace(/ /g, '');
                let spacelink = `${spacename.replace(' ', '_')}_`+generateRandomString();
                document.querySelector('#spacelink').value=spacelink;
                /* let hreflink = `${location.origin}/space/${spacelink}`;
                 let txt =`Your space has been created. &nbsp;&nbsp;  Please press the Login Space button. <br> Copy this url  <u style='color:#0D43CC'>${hreflink}</u> for invitation.`;
                 descrip_txt.innerHTML=txt;
                 descrip_txt.style.color="#4ecc0d";*/
            }
        });

        $('#login_space').click(function (e){
            e.preventDefault();

            if(createSpace()==0)
                return;

            let spacelinek = document.querySelector('#spacelink').value;
            if(spacelinek)
            {
                let username = document.querySelector('#username').value;
                let spacename = document.querySelector('#spacename').value;
                $.ajax({
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    url: "/checkequalspaceuser",
                    type: 'POST',
                    data: {'username':username,'spacename': spacelinek},
                    async:false,
                    dataType: 'json',
                    success: function(data, textStatus, jqXHR)
                    {
                        if(data.msg=="ok")
                        {
                            if(parseInt(data.flag) == 0 || parseInt(data.flag) == 3)
                            {
                                $('.form-group.form-group-normal').css('display','none');
                                $('.form-group.form-group-alert').css('display','block');
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

                            let felem = document.forms["space_frm"];
                            let f_ac = felem.getAttribute('action');
                            f_ac = f_ac + "/"+spacelinek;
                            document.querySelector("#condi").value="owner";
                            felem.setAttribute('action',f_ac);
                            felem.submit();

                        }
                        else
                            alert("It's an error => " + jqXHR.responseText);

                    },
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        alert("ajax error => " + jqXHR.responseText);
                    }
                });

            }

        });

        $('#log_out').click(function (e){
            e.preventDefault();
            document.getElementById('logout-form').submit();
        });

        $('.form-group-alert .btn_confirm').click(function (e) {
            e.preventDefault();
            let username = document.querySelector('#username').value;
            if(username)
            {
                $.ajax({
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    url: "/LogoutUserFromSpace",
                    type: 'POST',
                    data: {'username':username},
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
                            alert(data.msg);

                    },
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        alert("ajax error");
                    }
                });

            }
            else{
                alert("your ID are required");
            }
        });
        $('.form-group-alert .btn_cancel').click(function (e) {
            e.preventDefault();
            $('.form-group.form-group-normal').css('display','block');
            $('.form-group.form-group-alert').css('display','none');
        })

    })
</script>
@endsection
