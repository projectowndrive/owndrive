<?php
/**
 * Created by PhpStorm.
 * User: Wave Studios
 * Date: 04/21/15
 * Time: 12:00 PM
 */

namespace OwnDrive\Services;

use Auth;
use Illuminate\Foundation\Bus\DispatchesCommands;
use OwnDrive\Commands\HandleErrorCommand;
use OwnDrive\Commands\HandleResponseCommand;
use OwnDrive\User;



class AuthService {

    use DispatchesCommands;

    function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * @param string $username
     * @param string $password
     * @param bool $remember
     * @return bool
     */
    function login($username, $password, $remember){
        $response = [];

        try{
        if (Auth::attempt(['username'=>$username, 'password'=>$password], $remember)){
            $response = Auth::getUser()->toArray();
            $response['loginStatus'] = true;


        } else {
            $response['loginStatus'] = false;
        }
        } catch (\Exception $e){
            return $this->dispatch(new HandleErrorCommand($e->getMessage()));
        }

        return $response;

    }



    /**
     * @param $details
     */
    function register($details){
        $user = $this->user->create([
            'username' => $details['username'],
            'firstname' => $details['first_name'],
            'lastname' => $details['last_name'],
            'email' => $details['email'],
            'password' => \Hash::make($details['password'])
        ]);

    }

    /**
     * @return bool
     */
    function logout(){
        try{
            Auth::logout();
        }
        catch (\Exception $e){
            return false;
        }
        return true;
    }

    /**
     * @return bool
     */
    function checkAuth() {
        if (Auth::check())
        {
            return true;
        }

        return false;
    }
}