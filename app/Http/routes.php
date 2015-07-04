<?php

use Illuminate\Support\Facades\Response;
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function(){
    return View::make('index');
});


Route::group(['domain' => 'backend.'. preg_replace('#^https?://#', '', Config::get('app.url'))], function(){
    Route::post('/register', 'AuthController@register');
    Route::post('/login', 'AuthController@login');
    Route::post('/logout', 'AuthController@logout');
    Route::post('/checkauth', 'AuthController@checkAuth');
    Route::get('/downloadfile/{downloadkey}/', 'FilesController@downloadFile');

    /* Route::post('/createdir', function(\Illuminate\Http\Request $request){
         dd($request->all());
     });*/


});


Route::group(['domain' => 'backend.'. preg_replace('#^https?://#', '', Config::get('app.url')), 'middleware' => 'auth'], function(){






    //To be passed through Middleware
    Route::post('/upload', 'FilesController@uploadFile');
    Route::post('/createdir', 'FilesController@createDirectory');

    Route::post('/getfiles', 'FilesController@getFiles');
    Route::post('/getfilessharedwith', 'FilesController@getFilesSharedWith');
    Route::post('/getrecentfiles', 'FilesController@getRecentFiles');
    Route::post('/getfavoritefiles', 'FilesController@getFavoriteFiles');
    Route::post('/gettrashedfiles', 'FilesController@getTrashedFiles');
    Route::post('/searchfiles', 'FilesController@searchFiles');

    Route::post('/renamefile', 'FilesController@renameFile');
    Route::post('/copyfile', 'FilesController@copyFile');
    Route::post('/movefile', 'FilesController@moveFile');

    Route::post('/deletefile', 'FilesController@deleteFile');
    Route::post('/trashfile', 'FilesController@trashFile');
    Route::post('/restorefile', 'FilesController@restoreFile');


    Route::post('/addfavorites', 'FilesController@addFavorites');
    Route::post('/removefavorites', 'FilesController@removeFavorites');
    Route::post('/sharefile', 'FilesController@shareFile');
    Route::post('/managefileshare', 'FilesController@fileShareManager');
    Route::post('/removesharefile', 'FilesController@removeShareFile');

    Route::post('/getdownloadurl', 'FilesController@getDownloadUrl');

    Route::get('/getsettingresource/{resource}', 'SettingsController@settingResourceProvider');
    Route::get('/settings/{settingName}', 'SettingsController@getSettings');
    Route::post('/settings/{settingName}/save', 'SettingsController@saveSettings');


});



/*
Route::controllers([
	'auth' => 'Auth\AuthController',
	'password' => 'Auth\PasswordController',
]);*/





Route::options('{all}', function () {

    $response = Response::make(null, 200);
    $response->headers->set('Access-Control-Allow-Origin', /*'*');*/ Config::get('app.url') . ':8000');
    $response->headers->set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH, OPTIONS');
    $response->headers->set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');

    return $response;
})->where([ 'all' => '.*' ]);