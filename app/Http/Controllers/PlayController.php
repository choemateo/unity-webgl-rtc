<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Whatsapp\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PlayController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
       // $this->middleware('auth');
       /* header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Credentials: true ");
        header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
        header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");*/
    }


    public function getDeviceType(){
        // (A) MOBILE DEVICE CHECK
        $isMob = strpos(strtolower($_SERVER['HTTP_USER_AGENT']), "mobile") > -1 ? true : false;
        // (B) TABLET CHECK
        $isTab = strpos(strtolower($_SERVER['HTTP_USER_AGENT']), "tablet") > -1 ? true : false;
        $isPlaybook = strpos(strtolower($_SERVER['HTTP_USER_AGENT']), "playbook") > -1 ? true : false;
        $isOperamini = strpos(strtolower($_SERVER['HTTP_USER_AGENT']), "opera mini") > -1 ? true : false;
        // (C) DESKTOP?
        $isDesktop = !$isMob && !$isTab;
        // (D) MANY OTHERS...
        $isWin = strpos(strtolower($_SERVER['HTTP_USER_AGENT']), "windows") > -1 ? true : false;
        $isAndroid = strpos(strtolower($_SERVER['HTTP_USER_AGENT']), "android") > -1 ? true : false;
        $isIPhone = strpos(strtolower($_SERVER['HTTP_USER_AGENT']), "iphone") > -1 ? true : false;
        $isIPad = strpos(strtolower($_SERVER['HTTP_USER_AGENT']), "ipad") > -1 ? true : false;
        if(!$isIPad)
            $isIPad = strpos(strtolower($_SERVER['HTTP_USER_AGENT']), "macintosh") > -1 ? true : false;
        $isIOS = $isIPhone || $isIPad ;


        if(preg_match("/(iphone|android|ipad|ipod|webos)/i", strtolower($_SERVER['HTTP_USER_AGENT'])))
            $isTouch=true;
        else
            $isTouch=false;

        /*
        $m_detect = new Mobile_Detect;
        if($m_detect->isTablet())
            $curdevice="T";
        else
        if($m_detect->isMobile())
            $curdevice="M";
        else
            $curdevice="D";

        if(!$m_detect->isMobile())
          if (preg_match('/(tablet|ipad|playbook)|(android(?!.*(mobi|opera mini)))/i', strtolower($_SERVER['HTTP_USER_AGENT'])))
            $curdevice="T";
        */

        $device = array(
            'isMob'=>  $isMob,
            'isTab'=>  $isTab,
            'isDesktop'=>  $isDesktop,
            'isWin'=>  $isWin,
            'isAndroid'=>  $isAndroid,
            'isIPhone'=>  $isIPhone,
            'isIPad'=>  $isIPad,
            'isIOS'=>  $isIOS,
            'isPlaybook'=>  $isPlaybook,
            'isOperamini'=>  $isOperamini
        );

        return $device;
    }//getDeviceType

    public function currentDeviceInfo(){
        $device_g = $this->getDeviceType();

        $isMob = $device_g["isMob"];
        $isTab = $device_g["isTab"];
        $isDesktop = $device_g["isDesktop"];
        $isWin = $device_g["isWin"];
        $isAndroid = $device_g["isAndroid"];
        $isIPhone = $device_g["isIPhone"];
        $isIPad = $device_g["isIPad"];
        $isIOS = $device_g["isIOS"];
        $isPlaybook = $device_g["isPlaybook"];
        $isOperamini = $device_g["isOperamini"];

        $curdevice="D";
        if($isMob)
            $curdevice="M";
        else if($isTab)
            $curdevice="T";
        else if($isIPhone)
            $curdevice="M";
        else if($isAndroid)
            $curdevice="M";
        else if($isDesktop)
            $curdevice="D";

        /*$curOS="win";
        if($isWin)
            $curOS="win";
        else if($isAndroid)
            $curOS="android";
        else if($isIPhone)
            $curOS="iphone";
        else if($isIPad)
            $curOS="ipad";
        else if($isIOS)
            $curOS="ios";*/

        //  if($curdevice=="D" && $isIPad)//request desktop website is on
        //     $curdevice="T";
        if($curdevice=="M" && $isIPad)//request desktop website is off
            $curdevice="M";

        return $curdevice;
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
           $user = Auth::user();
           $id = Auth::id();
           $name = $user['name'];
           $email = $user['email'];
           $userinfo = array(
               'id'=>$id,
               'name'=>$name,
               'email'=>$email
           );

           return view('play', $userinfo);
    }

    // To view by invitation
    public  function inviteByLink(Request $request, $spacename=null)
    {
        $flag=false;
        if($spacename!==null) {
            $where =' spacename = "'.$spacename.'"';
            $row = DB::table('office_spaces')
                ->select(DB::raw('id'))
                ->whereRaw($where)->get()->first();
            if ($row !== null && !empty($row))
                $flag = true;
        }
        else{
            echo "space name(room name) must non empty";
            exit();
        }

        if (!$flag)
        {
            echo "Space name is Error!";
            exit();
        }
        else
        {
            $message ="This field must don't empty!";
            return view('inviteSpace', ['spacename'=>$spacename, 'message'=>$message]);
        }

    }

    public function  checkEqualSpaceUser(Request $request)
    {
        $username = $request->post("username");
        $spacename = $request->post("spacename");

        $flag=-1;
        $row = DB::table('office_spaces')
            ->select(DB::raw('id, spacename, buildname, avatar, state, type'))
            ->where('username', '=', $username)->get()->first();
        $r_spacename = "";
        if ($row !== null && !empty($row))
        {
            $r_type = $row->type;
            $r_spacename = $row->spacename;
            $r_state = $row->state;
                if($r_state=="on")//already logined in room
                {
                    if(!empty($row->buildname) && !empty($row->avatar))
                        $flag = 0;
                    else
                        $flag = 3;
                }
               else if($r_state=="off" && $r_type == "owner")
                {
                    $flag = 1;
                }
                else if($r_state=="off" && $r_type == "invite")
                {
                    $flag = 2;
                }

        }

        $msg="ok";

        return \Response::json([
            'msg'   =>  $msg,
            'flag'=> $flag,
            'spacename'=>$r_spacename
        ]);

        exit();
    }



    //when incoming owner in game play
    public  function space(Request $request){
        $c_spacename = $request->post('spacename');
        $username = $request->post('username');
        $spacename = $request->post('spacelink');
        $condi = $request->post('condi');
        $created_at = date("Y-m-d h:i:s", time());
        $device = $this->currentDeviceInfo();
        if($condi=="invite")
        {
            $result = DB::table('office_spaces')
                ->where('username', $username)
                ->update([
                    'state'=>'off'
                ]);

            $spacename = $c_spacename;
            $row = DB::table('office_spaces')
                ->select(DB::raw('*'))
                ->where([
                    ['spacename' ,'=', $spacename],
                    ['type' ,'=', 'owner']
                ])->get()->first();

            if(empty($row->spacename) || empty($row->buildname) || empty($row->floor))
            {
                echo "Sorry. Please wait for a while and come back in.<br>The room has not been opened exactly yet.";
                exit();
            }
            //$spacename = $row->spacename;
            $buildname = $row->buildname;
            $floor = $row->floor;
            $avatar =  '';

            $urow = DB::table('office_spaces')
                ->select(DB::raw('*'))
                ->where([
                    ['username' ,'=', $username],
                    ['spacename' ,'=', $spacename]
                ])->get()->first();

            if ($urow)
            {
                $result = DB::table('office_spaces')
                    ->where('id', $urow->id)
                    ->update([
                       /* 'spacename' => $spacename,*/
                        'buildname' => $buildname,
                        'floor'=> $floor,
                        'avatar'=> $avatar,
                        'type'=> 'invite',
                        'state'=> 'off',
                        'create_at'=> $created_at
                    ]);
                $spaceid = $urow->id;
            }
            else
            {

                $created_at = date("Y-m-d h:i:s", time());
                $spaceid = DB::table('office_spaces')->insertGetId([
                    'spacename'=>$spacename,
                    'username'=>$username,
                    'buildname'=> $buildname ,
                    'floor'=> $floor,
                    'avatar'=>$avatar,
                    'type'=>'invite',
                    'state'=>'off',
                    'create_at'=>$created_at
                ]);

            }

            $userinfo = array(
                'uid'=>0,
                'spaceid'=>$spaceid,
                'spacename'=>$spacename,
                'username'=>$username,
                'buildname'=>$buildname,
                'floor'=>$floor,
                'avatar'=>$avatar,
                'type'=>'invite'
            );

            return view('play', ['userinfo'=>$userinfo, 'device'=>$device]);
        }
        else
        {
            $result = DB::table('office_spaces')
                ->where('username', $username)
                ->update([
                    'state'=>'off'
                ]);

            $sql = "SELECT id, type, username, spacename, buildname, avatar, (SELECT id FROM users WHERE NAME=username) AS uid FROM office_spaces ";
            $sql .= " WHERE username = '".$username."'";
            $sql .= " limit 1";
            $row = DB::select( DB::raw($sql) );
            $uid = 0;
            if ($row !== null && count($row) > 0 && !empty($row)){
                $result = DB::table('office_spaces')
                    ->where('id', $row[0]->id)
                    ->update([
                        'spacename'=>$spacename,
                        'buildname'=>'',
                        'floor'=>'floor1',
                        'avatar'=>'',
                        'type'=>'owner',
                        'state'=>'off',
                        'create_at'=>$created_at
                    ]);
                $spaceid = $row[0]->id;
                $uid = $row[0]->uid;
            }
           else
            {
                $sql = "SELECT id FROM users WHERE name='".$username."'  limit 1";
                $row = DB::select( DB::raw($sql) );
                $uid = $row[0]->id;

                $spaceid = DB::table('office_spaces')->insertGetId([
                    'spacename'=>$spacename,
                    'username'=>$username,
                    'buildname'=>'',
                    'floor'=>'floor1',
                    'avatar'=>'',
                    'type'=>'owner',
                    'state'=>'off',
                    'create_at'=>$created_at
                ]);
            }

            $userinfo = array(
                'uid'=> $uid,
                'spaceid'=>$spaceid,
                'spacename'=>$spacename,
                'username'=>$username,
                'buildname'=>'',
                'floor'=>'floor1',
                'avatar'=>'',
                'type'=>'owner'
            );

            return view('play', ['userinfo'=>$userinfo, 'device'=>$device]);
        }
    }

    /*
     * call from unity
     */
    public function setPlayUserInfo(Request $request){
        //uid=3,  spaceid=6, spacename=aaa_g91izyfobgp,
        //username=ckd, buildname=Building_03-3, floor=floor3, type=owner, avatar=F_Businesswoman_Basic

        $playinfo = $request->post("info");
        $arr_str= explode(",", $playinfo);

        $spaceid=0;
        $spacename="";
        $buildname="";
        $floor="";
        $type="";
        $avatar="";
        $uid=0;

        foreach($arr_str as $val){
            $without_space = str_replace(' ','',$val);
            $without_equal= explode("=", $without_space);

            if($without_equal[0] ==="spaceid")
                $spaceid = $without_equal[1];
            else if($without_equal[0]==="spacename")
                $spacename=$without_equal[1];
            else if($without_equal[0]==="buildname")
                $buildname=$without_equal[1];
            else if($without_equal[0]==="floor")
                $floor=$without_equal[1];
            else if($without_equal[0]==="type")
                $type=$without_equal[1];
            else if($without_equal[0]==="avatar")
                $avatar=$without_equal[1];
            else if($without_equal[0]==="uid")
                $uid=$without_equal[1];
        }

        $flag=true;
        $ex="";
        try{
            if($type == 'owner'){
                $affected = DB::table('office_spaces')
                    ->where('id', (int)$spaceid)
                    ->update([
                        'spacename' => $spacename,
                        'buildname' => $buildname,
                        'floor' => $floor,
                        'avatar' => $avatar,
                        'state' => 'on'
                    ]);
            }
            else
            {
                $affected = DB::table('office_spaces')
                    ->where('id', (int)$spaceid)
                    ->update([
                       /* 'spacename' => $spacename,*/
                        'avatar' => $avatar,
                        'state' => 'on'
                    ]);
            }

        }
        catch (\Exception $e){
            $flag=false;
            $ex = $e->getMessage();
        }
        $msg="ok";
        if(!$flag)
            $msg="err";

        return \Response::json([
            'msg'   =>  $msg,
            'ex'=>$ex
        ]);
    }

    public function leavePlayUserInfo(Request $request){
        $username = $request->post("username");
        $spacename = $request->post("spacename");
        try{
            $sucess = DB::table('office_spaces')->where([
                ['spacename' ,'=', $spacename],
                ['username' ,'=', $username]
            ])->update([
                'state'=>'off'
            ]);
          /*  $sucess = DB::table('office_spaces')->where([
                ['spacename' ,'=', $spacename],
                ['username' ,'=', $username]
            ])->delete();*/
            $count = DB::table('office_spaces')->where([
                ['spacename','=', $spacename],
                ['state' ,'=', 'on']
            ])->count();
            if($count < 1)
                $ret = DB::table('office_spaces')->where('spacename', '=', $spacename)->delete();
        }
        catch (\Exception $e){
        }

        return \Response::json([
            'msg'   => "ok"
        ]);
    }

    public function delPlayUserInfo(Request $request){
        //uid=3,  spaceid=6, spacename=aaa_g91izyfobgp,
        //username=ckd, buildname=Building_03-3, floor=floor3, type=owner, avatar=F_Businesswoman_Basic
        $playinfo = $request->post("info");
        $arr_str= json_decode($playinfo);
        $spaceid= $arr_str->spaceid;
        $spacename = $arr_str->spacename;
            try{
                $sucess = DB::table('office_spaces')->where('id', '=', $spaceid)->update([
                    'state'=>'off'
                ]);
               // $sucess = DB::table('office_spaces')->where('id', '=', $spaceid)->delete();
                $count = DB::table('office_spaces')->where([
                        ['spacename','=', $spacename],
                        ['state' ,'=', 'on']
                    ])->count();
                if($count < 1)
                    $ret = DB::table('office_spaces')->where('spacename', '=', $spacename)->delete();
            }
            catch (\Exception $e){
            }
         return \Response::json([
            'msg'   => "ok"
        ]);
    }

    public function LogoutUserFromSpace(Request $request)
    {
        $username = $request->post("username");
        $msg = "ok";
        try{

            $row = DB::table('office_spaces')
                ->select(DB::raw('spacename, type'))
                ->where('username', '=', $username)->get()->first();
            $type = $row->type;
            $spacename = $row->spacename;
            if($type != 'owner'){
                $sucess = DB::table('office_spaces')->where('username', '=', $username)->delete();
            }
            else{
                $sucess = DB::table('office_spaces')->where('username', '=', $username)->update([
                    'state'=>'off'
                ]);
            }
            $count = DB::table('office_spaces')->where([
                ['spacename','=', $spacename],
                ['state' ,'=', 'on']
            ])->count();
            if($count < 1)
                $ret = DB::table('office_spaces')->where('spacename', '=', $spacename)->delete();

        }
        catch (\Exception $e){
            $msg = $e->getMessage();
        }

        return \Response::json([
            'msg'   => $msg
        ]);
    }

}
