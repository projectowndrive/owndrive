<?php namespace OwnDrive\Http\Controllers;

use OwnDrive\Commands\HandleErrorCommand;
use OwnDrive\Commands\HandleResponseCommand;
use OwnDrive\Http\Requests;
use OwnDrive\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Response;
use OwnDrive\Http\Requests\LoginRequest;
Use OwnDrive\Http\Requests\RegisterUserRequest;

Use OwnDrive\Services\AuthService;

class AuthController extends Controller {

    private $auth;

    function __construct(AuthService $authService)
    {
        $this->auth = $authService;

    }

    /**
     * @param LoginRequest $request
     * @return mixed
     */
    function login(LoginRequest $request)
    {

        try {
            return $this->auth->login($request->input('username'), $request->input('password'), $request->input('remember'));
                //$response = Response::make(, 200);
        }
        catch (\Exception $e){
            $response = Response::make(['status'=> 'error', 'message'=>$e], 500);
        }

        return $response;
    }

    /**
     * @param RegisterUserRequest $request
     * @return mixed
     */
    function register(RegisterUserRequest $request)
    {
        try{
            $this->auth->register($request->all());
            $response = $this->dispatch(new HandleResponseCommand("Registered"));
        }
        catch (\Exception $e){
            $response = $this->dispatch(new HandleErrorCommand("Registration failed"));
        }

        return $response;
    }

    /**
     * @return mixed
     */
    function logout()
    {
        try{
            $this->auth->logout();
        }
        catch(\Exception $e){
            $response = Response::make(['status'=>'error'],500);
            return $response;
        }

        $response = Response::make(['loginStatus'=>false],200);
        return $response;
    }

    /**
     * @return mixed
     */
    function checkAuth(){
        try{
            if ($this->auth->checkAuth()){
            $response = Response::make(['authState'=>'true'],200);
            }
            else{
                $response = Response::make(['authState'=>'false'],200);
            }
            return $response;
        }
        catch (\Exception $e) {
            $response = Response::make(['authState'=>'false'],500);
            return $response;
        }

    }
}
