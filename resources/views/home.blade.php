@php
/*

    $data = array( "format" => "urls" );
    $data_json = json_encode($data);

    $curl = curl_init();
    curl_setopt_array( $curl, array (
          CURLOPT_HTTPHEADER => array("Content-Type: application/json","Content-Length: " . strlen($data_json)),
          CURLOPT_POSTFIELDS => $data_json,
          CURLOPT_URL => "https://global.xirsys.net/_turn/virtualofficev01",
          CURLOPT_USERPWD => "mateodev:85e8fe92-13d6-11ec-ab52-0242ac150003",
          CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
          CURLOPT_CUSTOMREQUEST => "PUT",
          CURLOPT_RETURNTRANSFER => 1
    ));

    $resp = curl_exec($curl);
    if(curl_error($curl)){
          echo "Curl error: " . curl_error($curl);
    };
    curl_close($curl);
    echo($resp);
*/

@endphp
@extends('layouts.app')
@section('scripts')
    <script type="text/javascript" src="/js/jquery-3.6.0.min.js"></script>
@endsection
@section('content')
    <div class="container">
        <div class="row justify-content-center h-100">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">{{ __('Dashboard') }}</div>
                    <div class="card-body" style="color: #fff">
                        @if (session('status'))
                            <div class="alert alert-success" role="alert">
                                {{ session('status') }}
                            </div>
                        @endif
                     {{-- {{ __('You are logged in!') }} &nbsp; <a href="{{ url('/play') }}">Go to Play Page</a>--}}
                        {{ __('You are logged in!') }} &nbsp; <a href="{{ url('/home') }}" style="color: #fff46d">Go to Your Space Page</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
@section('page_scripts')
<script>
   /* window.onload = function() {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function($evt){
            if(xhr.readyState == 4 && xhr.status == 200){
                let res = JSON.parse(xhr.responseText);
                var ices = res.v.iceServers;
                console.log("response: ",ices);
            }
        }
        xhr.open("PUT", "https://global.xirsys.net/_turn/virtualofficev01", true);
        xhr.setRequestHeader ("Authorization", "Basic " + btoa("mateodev:85e8fe92-13d6-11ec-ab52-0242ac150003") );
        xhr.setRequestHeader ("Content-Type", "application/json");
        xhr.send( JSON.stringify({"format": "urls"}) );
    };*/
</script>
@endsection
