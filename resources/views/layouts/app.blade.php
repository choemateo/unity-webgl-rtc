<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>
    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('css/play.css') }}" rel="stylesheet">

    <style>
        body div#app{
            position: relative;
            width: 100%;
            min-width: 100vw;
            height: 100%;
            min-height: 100vh;
            display: flex;
            background: #00000096;
        }
        body div#app::before {
            content: "";
            background-image: url('/img/logbk_small_1024.gif');
            background-size: 100% 100%;
            background-repeat: no-repeat, no-repeat;
            position: absolute;
            top: 0px;
            right: 0px;
            bottom: 0px;
            left: 0px;
            opacity: 1;
        }
        .card{
            position: absolute;top: 45%; left: 50%;
            transform: translate(-50%, -50%);
            border-radius:1.0rem;
            background-color: #f3f5f799;
            min-width: 350px;
        }
        .card-header{
            border: 0; background-color: transparent;
            font-size: 1.7rem;
            color: white;
            font-weight:800;
            padding: 0.5rem 1.25rem;
        }
        input#name, input#email, input#password, input#password-confirm, input#Regsubmit, input#loginsubmit{
            border:1px solid #ffffff;
            border-radius: 10px;
            background-color: #ffffff3b;
            height: calc(1.1em + 0.75rem + 2px);
            padding: 0.175rem 0.75rem;
            color: #ffffff;
        }
        input#name, input#email, input#password, input#password-confirm {
            background-color: #ffffff3b !important;
            color: #ffffff !important;
        }
        input#Regsubmit, input#loginsubmit{
            background-color: #d5c84a;
            border-color: #edde4dad;
            height: calc(1.25em + 0.75rem + 2px);
        }
    </style>
    @yield('pagestyle')

    <!-- Scripts -->
    <script src="{{ asset('js/bootstrap.js') }}" defer></script>
    @yield('scripts')

</head>

<body>
    <div id="app">
       @yield('content')
    </div>

      @yield('page_scripts')

</body>

</html>
