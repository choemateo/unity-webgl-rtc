<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    public function LoginList(Request $request, $name='0')
    {
        if (!session()->has('admin'))
            return redirect()->route('admin');

        if(empty($name) || $name == '0' || $name == ''){
            $userinfo = DB::table('users')
                ->whereRaw('manage <> 1')
                ->orderBy('id')->get();
        }
        else
        {
            $userinfo = DB::table('users')
                ->whereRaw('manage <> 1 and name like "%'.$name.'%"')
                ->orderBy('id')
                ->get();
        }

        return view('admin.loginlist', ['mu'=>'loginlist','users'=>$userinfo]);
    }

    public function RoomList(Request $request, $roomname='0')
    {
        if (!session()->has('admin'))
            return redirect()->route('admin');

        if(empty($roomname) || $roomname == '0' || $roomname == ''){

            $rows = DB::table('office_spaces')
                ->select('spacename')
                ->groupBy('spacename')
                ->get();
        }
        else
        {
            $rows = DB::table('office_spaces')
                ->select('spacename')
                ->groupBy('spacename')
                ->whereRaw('spacename like "%'.$roomname.'%"')
                ->get();
        }
        $rooms = array();
        foreach ($rows as $row){
            if($row->spacename != null){
                $usercount = DB::table('office_spaces')->where([
                    ['spacename','=', $row->spacename],
                    ['state','=', 'on']
                ])->count();
                $userinfo = DB::table('office_spaces')->where([
                    ['spacename','=', $row->spacename],
                    ['type','=', 'owner']
                ])->get()->first();
                $room = array(
                    'spacename'=>$row->spacename,
                    'count'=>$usercount,
                    'username'=>empty($userinfo) ? '' : $userinfo->username,
                    'create_at'=>empty($userinfo) ? '' : $userinfo->create_at
                );
               array_push($rooms, $room);
            }
        }
        return view('admin.roomlist', ['mu'=>'roomlist','rooms'=>$rooms]);
    }

    public function UserList(Request $request, $name='0')
    {
        if (!session()->has('admin'))
            return redirect()->route('admin');

        if(empty($name) || $name == '0' || $name == ''){
            $userinfo = DB::table('office_spaces')
                ->where([
                    ['state','=', 'on']
                ])
                ->orderBy('spacename')->get();
        }
        else{
            $userinfo = DB::table('office_spaces')
                ->whereRaw('state = "on" and username like "%'.$name.'%"')
                ->orderBy('spacename')
                ->get();
        }
        return view('admin.userlist', ['mu'=>'userlist','rooms'=>$userinfo]);
    }

    public function deleteLoginuser(Request $request)
    {
        $id = $request->post('id');
        try{
        $ret = DB::table('users')->where('id', '=', $id)->delete();
        }
        catch (\Exception $e){
        }

        return \Response::json([
            'msg'   => "ok"
        ]);
    }

}
