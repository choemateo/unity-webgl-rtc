<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\AdminController;
use Illuminate\Validation\ValidationException;

class NormalController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {

    }

    private function generateToken($request)
    {
        $token = $request->user()->createToken('wossop_token');
        return ['token' => $token->plainTextToken];
    }

    public function Avatar(Request $request, $spId='0'){
        $id = (int)$spId;
        return view('elegant.Avatar', ['dashId' => 'pages-avatar', 'id'=>$id]);
    }

    public function Play(Request $request, $spId='0'){
        $id = (int)$spId;
        if($id > 0){
            $where =' id = "'.$id.'"';
            $row = DB::table('office_spaces')
                ->select(DB::raw('*'))
                ->whereRaw($where)->get()->first();
            $row->dashId = 'pages-play';
            if(empty($row->avatar))
                $row->avatar='F_Businesswoman';

            $realArray = (array)$row;
            return view('elegant.GamePlay',$realArray);
        }
        else
            return view('elegant.GamePlay', ['dashId' => 'pages-play', 'id'=>$id]);

    }

    public function CreateRoom(Request $request){
        return view('elegant.CreateRoom');
    }

    public function ViewCharacterUrl(Request $request, $spacename, $buildname, $avatar='non', $id=0){
        $sid = (int)$id;
        if($avatar==='non')
            $avatar='';

        if($sid == 0){
            $id = DB::table('office_spaces')->insertGetId([
                'spacename'=>$spacename,
                'buildname'=>$buildname,
                'avatar'=>$avatar,
                'owner'=>'user',
                'visitor'=>''
            ]);
        }
        else
        {
            $result = DB::table('office_spaces')
                ->where('id', $sid)
                ->update([
                    'spacename'=>$spacename,
                    'buildname'=>$buildname,
                    'avatar'=>$avatar
                ]);
        }

        $where =' id = "'.$sid.'"';
        $row = DB::table('office_spaces')
            ->select(DB::raw('id, spacename, buildname, avatar, owner, visitor'))
            ->whereRaw($where)->get()->first();

        $realArray = (array)$row;
        return view('elegant.ViewCharacterUrl',$realArray);
    }

    public function ViewCharacter(Request $request){
        $id = $request->get('id');
        $where =' id = "'.$id.'"';
        $row = DB::table('office_spaces')
            ->select(DB::raw('id, spacename, buildname, avatar, owner, visitor'))
            ->whereRaw($where)->get()->first();
        $realArray = (array)$row;
        return view('elegant.ViewCharacter',$realArray);
    }


    public function EditCharacter(Request $request)
    {
        $id = $request->get('id');
        $where =' id = "'.$id.'"';
        $row = DB::table('office_spaces')
            ->select(DB::raw('id, spacename, buildname, avatar, owner, visitor'))
            ->whereRaw($where)->get()->first();
        $realArray = (array)$row;
        return view('elegant.EditCharacter',$realArray);
    }

    public function ISValidSpace(Request $request){
        $spaceName = $request->post('spaceName');

        $where =' spacename = "'.$spaceName.'"';
        $row = DB::table('office_spaces')
            ->select(DB::raw('id, spacename'))
            ->whereRaw($where)->get()->first();
        if ($row !== null && !empty($row)){
            return \Response::json([
                'spaceName'  =>  $spaceName,
                'rid'=> $row->id,
                'msg'=> 'has'
            ]);
        }
        else{
            return \Response::json([
                'spaceName'  =>  $spaceName,
                'rid'=> 0,
                'msg'=> 'ok'
            ]);
        }

        exit(0);
    }

    public function checkadminuser(Request $request)
    {
        // TODO: when a new user registers, you can broadcast their details so that they are added to the
        // allUsers fetched on the frontend
        $name = $request->post("name");
        $email = $request->post("email");
        $password = $request->post("password");
        $where =' name = "'.$name.'" AND email = "'.$email.'" AND password = "'.$password.'" AND manage = 1';
        $row = DB::table('users')
            ->select(DB::raw('id, name, email, password'))
            ->whereRaw($where)->get()->first();
        $msg="err";
        if($row != null && $row != '') {
            $msg = "ok";

            if (!session()->has('admin'))
              session()->put('admin', $name);
        }
        else
        {
            if (session()->has('admin'))
                session()->remove('admin');
        }

        return \Response::json([
            'msg'   =>  $msg
        ]);
    }

    public function checkRegisterUser(Request $request)
    {
        $email = $request->post("email");
        $where =' email = "'.$email.'" ';
        $row = DB::table('users')
            ->select(DB::raw('id'))
            ->whereRaw($where)->get()->first();
        $msg="err";
        $msgtxt="You are not a registered user <br> Please register.";
        if($row != null && $row != '') {
            $msg = "ok";
            $msgtxt = "";
        }
        return \Response::json([
            'msg' =>  $msg,
            'msgtxt'=> $msgtxt
        ]);
    }

    public function playSpace(Request $request)
    {
        $request->validate([
            'email' => ['required'],
            'password' => ['required']
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            Log::info('type: Login, user:' . $request->email . ', datetime:' . now()->toDateTimeString() . ', client_ip: ' . $request->getClientIp());

            $token = $this->generateToken($request)['token'];

            // Update login time and IP Address used.
            Auth::user()->update([
                'last_login_at' => now()->toDateTimeString(),
                'last_login_ip' => $request->getClientIp()
            ]);

            $message ="This field must don't empty!";
            return view('playSpace',['username'=>Auth::user()->name, 'message'=>$message]);
        }

        throw ValidationException::withMessages([
            'name' => ['The provided credentials are incorrect.']
        ]);
    }

    public function scrap(Request $request){
        /*$ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://m.h8854asd.cn/#/betPK10F/FPK10/AZXYS/600/1');
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $response = curl_exec($ch);
        curl_close($ch);*/

        $url = 'https://m.h8854asd.cn/#/betPK10F/FPK10/AZXYS/600/1';
        $fp = fopen($url, 'r');
        $content = "";
        while(!feof($fp)) {
            $buffer = trim(fgets($fp, 4096));
            $content .= $buffer;
        }
        $start = '<title>';
        $end = '<\/title>';
        preg_match("/$start(.*)$end/s", $content, $match);
        $title = $match[1];
        $metatagarray = get_meta_tags($url);
        $description = $metatagarray["description"];

    }

}
