<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
/*Route::get('/', function () {
    return view('home');
});*/

Route::group(['middleware' => ['auth']], function () {
    Route::get('/video-chat', function () {
        // fetch all users apart from the authenticated user
        $users = User::where('id', '<>', Auth::id())->get();
        return view('video-chat', ['users' => $users]);
    });
    // Endpoints to alert call or receive call.
    Route::post('/video/call-user', 'App\Http\Controllers\VideoChatController@callUser');
    Route::post('/video/accept-call', 'App\Http\Controllers\VideoChatController@acceptCall');
    // Agora Video Call Endpoints
    Route::get('/agora-chat', 'App\Http\Controllers\AgoraVideoController@index');
    Route::post('/agora/token', 'App\Http\Controllers\AgoraVideoController@token');
    Route::post('/agora/call-user', 'App\Http\Controllers\AgoraVideoController@callUser');
    // WebRTC Group Call Endpoints
    // Initiate Stream, Get a shareable broadcast link
    Route::get('/streaming', 'App\Http\Controllers\WebrtcStreamingController@index');
    Route::get('/streaming/{streamId}', 'App\Http\Controllers\WebrtcStreamingController@consumer');
    Route::post('/stream-offer', 'App\Http\Controllers\WebrtcStreamingController@makeStreamOffer');
    Route::post('/stream-answer', 'App\Http\Controllers\WebrtcStreamingController@makeStreamAnswer');
});

/**
 * When you clone the repository, comment out
 *  Auth::routes(['register' => false]);
 * and uncomment
 *   Auth::routes()
 * so that you can register new users. I disabled the registration endpoint so that my hosted demo won't be abused.
 *
 */
 Auth::routes();
//Auth::routes(['register' => false]);
Route::get('/', function () {
   return redirect()->route('home');
});
Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
Route::post('/checkRegisterUser', [App\Http\Controllers\NormalController::class, 'checkRegisterUser']);
Route::post('/playSpace', [App\Http\Controllers\NormalController::class, 'playSpace'])->name('playSpace');

Route::post('/space/{spacename}', [App\Http\Controllers\PlayController::class, 'space']);
/*Route::post('/space_invist', [App\Http\Controllers\PlayController::class, 'space_Invist']);*/
Route::get('/space/{spacename}', [App\Http\Controllers\PlayController::class, 'inviteByLink']);

Route::post('/checkequalspaceuser', [App\Http\Controllers\PlayController::class, 'checkEqualSpaceUser']);
Route::post('/LogoutUserFromSpace', [App\Http\Controllers\PlayController::class, 'LogoutUserFromSpace']);

Route::post('/setPlayUserInfo', [App\Http\Controllers\PlayController::class, 'setPlayUserInfo']);
Route::post('/leavePlayUserInfo', [App\Http\Controllers\PlayController::class, 'leavePlayUserInfo']);
Route::post('/delPlayUserInfo', [App\Http\Controllers\PlayController::class, 'delPlayUserInfo']);

Route::get('/scrap', [App\Http\Controllers\NormalController::class, 'scrap']);

//================ part of admin ========================//
Route::get('/admin', function () {
    return view('admin');
})->name('admin');

Route::post('/checkadminuser', [App\Http\Controllers\NormalController::class, 'checkadminuser']);

Route::get('/adminlogout', function () {
    if (session()->has('admin'))
        session()->remove('admin');
    return redirect()->route('admin');
});

Route::get('/LoginList/{name}', [App\Http\Controllers\AdminController::class, 'LoginList'])->name('LoginList');
Route::get('/RoomList/{roomname}', [App\Http\Controllers\AdminController::class, 'RoomList'])->name('RoomList');
Route::get('/UserList/{name}', [App\Http\Controllers\AdminController::class, 'UserList'])->name('UserList');
Route::post('/deleteLoginuser', [App\Http\Controllers\AdminController::class, 'deleteLoginuser']);

