<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Whatsapp\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
       /* header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Credentials: true ");
        header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
        header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");*/
        $this->middleware('auth');
    }



    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
       if(Auth::check())
       {
           $user = Auth::user();
           $id = Auth::id();
           $name = $user['name'];
           $message ="This field must don't empty!";
           return view('playSpace',['username'=>$name, 'message'=>$message]);
       }
        else
          return view('auth.login')->with('message',  __('you have to login') );

    }

    public  function getUserID(){
        $id = Auth::id();
        return $id;
     }
    public  function getUserInfo(){
        $user = Auth::user();
        return $user;
    }

}//class
