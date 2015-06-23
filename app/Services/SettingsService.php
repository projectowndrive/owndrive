<?php

namespace OwnDrive\Services;


use Illuminate\Contracts\Auth\Guard;
use OwnDrive\User;

class SettingsService {

    /**
     * @var User
     */
    private $user;
    /**
     * @var Guard
     */
    private $auth;

    function __construct(User $user, Guard $auth)
    {
        $this->user = $user;
        $this->auth = $auth;
    }

    public function settingResourceProvider($resource){
        Switch($resource){
            case 'userlist':
                return $this->getUserList();
                break;
        }
    }

    private function getUserList(){
        //return $this->user->where('id', '!=', $this->auth->id())->get()->toArray();
        return $this->user->get(['id', 'username']);
    }
} 