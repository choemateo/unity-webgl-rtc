@extends('layouts.adminLayout')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header d-flex">{{ __('Admin User') }}
                    @if(isset($message))
                    <span style="margin-left: auto; color: red;">{!! $message !!}</span>
                    @endif
                </div>
                <div class="card-body">
                    <form method="POST" action="#" id="adminform" name="adminform">
                        @csrf

                        <div class="form-group row">
                            <label for="name" class="col-md-4 col-form-label text-md-right">{{ __('Admin ID') }}</label>

                            <div class="col-md-6">
                                <input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="name" value="{{ old('name') }}" required autocomplete="name" autofocus>

                                @error('name')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="email" class="col-md-4 col-form-label text-md-right">{{ __('E-Mail Address') }}</label>

                            <div class="col-md-6">
                                <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email">

                                @error('email')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="password" class="col-md-4 col-form-label text-md-right">{{ __('Password') }}</label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">

                                @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row mb-0">
                            <div class="col-md-6 offset-md-4">
                                <button type="button" class="btn btn-primary ml-3" id="login_space">
                                    {{ __('Login') }}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
    <script>
        document.getElementById('login_space').addEventListener('click', (e)=>{
            e.preventDefault();
                let name = document.querySelector('#name').value;
                let email = document.querySelector('#email').value;
                let password = document.querySelector('#password').value;
                $.ajax({
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    url: "/checkadminuser",
                    type: 'POST',
                    data: {'name':name,'email': email, 'password':password},
                    async:false,
                    dataType: 'json',
                    success: function(data, textStatus, jqXHR)
                    {
                        if(data.msg=="ok") {
                           window.location.href="/LoginList/0";
                        }
                        else
                            alert("Invalid admin name or email or password");

                    },
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        alert("ajax error => " + jqXHR.responseText);
                    }
                });


        });
    </script>
@endsection
