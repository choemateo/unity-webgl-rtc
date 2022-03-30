<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
<!--    <meta name="Origin" content="https://192.168.0.15">-->
    <meta http-equiv="Cache-Control" content="no-cache">

    <title>{{ config('app.name', 'Laravel') }}</title>
    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <!-- Styles -->
   <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link href="/css/play.css" rel="stylesheet">

    <link rel="stylesheet" type="text/css" href="/css/reset.css">
   <link rel="stylesheet" type="text/css" href="/css/koho.css">
    <link rel="stylesheet" type="text/css" href="/css/playstyle.css">

    @yield('pagestyle')
    <!-- Scripts -->
    <script src="{{ asset('js/bootstrap.js') }}" defer></script>
    @yield('scripts')

</head>

<body>
    <div id="app">
        <main>
            @yield('content')

            @yield('page_scripts')
        </main>
    </div>
</body>

</html>
