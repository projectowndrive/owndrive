<?php
/**
 * Created by PhpStorm.
 * User: Wave Studios
 * Date: 04/21/15
 * Time: 12:00 PM
 */

namespace OwnDrive\Services;

use Auth;
use OwnDrive\User;



class AuthService {



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
        if (Auth::attempt(['username'=>$username, 'password'=>$password], $remember)){
            return true;
        }

        return false;
    }

    /**
     * @param $details
     */
    function register($details){
        $user = $this->user->create([
            'username' => $details['username'],
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