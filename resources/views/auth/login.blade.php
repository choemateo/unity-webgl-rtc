@extends('layouts.app')
@section('scripts')
    <script type="text/javascript" src="/js/jquery-3.6.0.min.js"></script>
@endsection
@section('content')
    <div class="container">
        <div class="row justify-content-center h-100">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-body">
                        <div class="card-header text-center mb-1">{{ __('METASPACE.LIFE') }}</div>
                        <form method="POST" action="{{ route('playSpace') }}"  id="loginfrm" name="loginfrm">
                            @csrf

                            <div class="form-group msgbox">
                                <div class="col-md-12">
                                <span class="msgtxt" role="alert">

                                </span>
                                </div>
                            </div>

                            <div class="form-group" style="color: #fff">
                                <label for="email" class="col-md-12 text-md-left">{{ __('E-Mail') }}</label>

                                <div class="col-md-12">
                                    <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>

                                    @error('email')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group" style="color: #fff">
                                <label for="password" class="col-md-12 text-md-left">{{ __('Password') }}</label>

                                <div class="col-md-12">
                                    <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">

                                    @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group mt-4 mb-0" style="color: #fff">
                                <div class="col-md-12">
                                    <input type="button" id="loginsubmit" class="form-control" value="{{ __('Login') }}">
                                </div>
                            </div>
                            <div class="form-group mb-0" style="color: #fff">
                                <div class="col-md-12">
                                    @if (Route::has('password.request'))
                                        <a class="btn btn-link" href="{{ route('password.request') }}" style="color: #fff">
                                            {{ __('Forgot Your Password?') }}
                                        </a>
                                    @endif
                                    @if (Route::has('email.request'))
                                        <a class="btn btn-link" href="{{ route('email.request') }}" style="color: #fff">
                                            {{ __('Forget Your Email') }}
                                        </a>
                                    @endif
                                    @if (Route::has('register'))
                                        <a class="btn btn-link" href="{{ route('register') }}" style="color: #fff">{{ __('Register') }}</a>
                                    @endif
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
        function showmsg(txt){
            var tag = '<strong style="color:#e35a5a">'+txt+'</strong>';
            var msg = document.querySelector('.msgbox');
            if(msg)
            {
                var msgtxt = document.querySelector('.msgtxt');
                msgtxt.innerHTML = tag;
                $('.msgbox').css('display','block !important');
            }
            setTimeout(function () {
                if(msg){
                    var msgtxt = document.querySelector('.msgtxt');
                    msgtxt.innerHTML = '';
                    $('.msgbox').css('display','none !important');
                }
            }, 3000);
        }

        $(document).ready(function () {
            $('#loginsubmit').click(function (e) {
                e.preventDefault();
                let email = document.querySelector('#email').value;
                if (!email || !email.replace(/ /g, '').length){
                    let txt="Please input the email field.";
                    showmsg(txt);
                    return;
                }
                let password = document.querySelector('#password').value;
                if (!password || !password.replace(/ /g, '').length){
                    let txt="Please input the password field.";
                    showmsg(txt);
                    return;
                }

                $.ajax({
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    url: "/checkRegisterUser",
                    type: 'POST',
                    data: {'email': email, 'password':password},
                    async:true,
                    dataType: 'json',
                    success: function(data, textStatus, jqXHR)
                    {
                        if(data.msg!="ok") {
                            showmsg(data.msgtxt);
                        }
                        else
                        {
                            document.getElementById('loginfrm').submit();
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        alert("loginsubmit = >ajax error");
                    }
                });
            });
        });
    </script>
@endsection
