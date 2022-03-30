@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center h-100">
        <div class="col-md-8">
            <div class="card">
                <div class="card-body">
                    <div class="card-header text-center mb-1">{{ __('Reset Password') }}</div>

                    <form method="POST" action="{{ route('password.update') }}">
                        @csrf

                        <input type="hidden" name="token" value="{{ $token }}">

                        <div class="form-group" style="color: #fff">
                            <label for="email" class="col-md-12 text-md-left">{{ __('E-Mail Address') }}</label>

                            <div class="col-md-12">
                                <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ $email ?? old('email') }}" required autocomplete="email" autofocus>

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
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">

                                @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group" style="color: #fff">
                            <label for="password-confirm" class="col-md-12 text-md-left">{{ __('Confirm Password') }}</label>

                            <div class="col-md-12">
                                <input id="password-confirm" type="password" class="form-control" name="password_confirmation" required autocomplete="new-password">
                            </div>
                        </div>

                        <div class="form-group mb-3" style="margin-top: 1.5rem">
                            <div class="col-md-12">
                                <input type="submit" id="Regsubmit" class="form-control" value="{{ __('Reset Password') }}">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
