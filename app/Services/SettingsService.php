<?php

namespace OwnDrive\Services;


use Illuminate\Contracts\Auth\Guard;
use Illuminate\Foundation\Bus\DispatchesCommands;
use Intervention\Image\Facades\Image;
use OwnDrive\Commands\HandleErrorCommand;
use OwnDrive\Commands\HandleResponseCommand;
use OwnDrive\User;

class SettingsService
{

    use DispatchesCommands;
    /**
     * @var User
     */
    private $user;
    /**
     * @var Guard
     */
    private $auth;
    /**
     * @var Auth
     */
    private $authenticatable;

    function __construct(User $user, Guard $auth)
    {
        $this->user = $user;
        $this->auth = $auth;
    }

    public function settingResourceProvider($resource)
    {
        Switch ($resource) {
            case 'userlist':
                return $this->getUserList();
                break;
        }
    }

    public function getSettings($settingName, $request)
    {

    }

    /**
     * @param $settingName
     * @param $request
     * @return mixed
     */
    public function saveSettings($settingName, $request)
    {
        switch ($settingName) {
            case 'profilepic':
                return $this->saveProfilePic($request);
                break;
            case 'profilesettings':
                return $this->saveProfileSettings($request);
                break;
            case 'newpassword':
                return $this->changePassword($request);
                break;
        }
    }

    private function getUserList()
    {
        //return $this->user->where('id', '!=', $this->auth->id())->get()->toArray();
        return $this->user->get(['id', 'first_name', 'last_name', 'email', 'profile_pic']);
    }


    /**
     * @param $request
     * @return mixed
     */
    private function saveProfilePic($request)
    {

        $userId = $this->auth->id();
        $user = $this->user->find($userId);
        $name = $user['profile_pic'];


        if ($name === 'default.jpg') {
            $name = str_random(40) . '.jpg';
        }

        $path = public_path() . '\img\profile\\' . $name;

        try {
            Image::make(\Input::file('image'))->fit(500, 500)->save($path);
        } catch (\Exception $e) {
            return $this->dispatch(new HandleErrorCommand($e->getMessage()));
        }

        $user->profile_pic = $name;
        $user->save();

        return $this->dispatch(new HandleResponseCommand('Profile picture saved.'));
    }

    private function saveProfileSettings($request)
    {
        try {

            $userId = $this->auth->Id();
            $user = $this->user->find($userId);

            $user->first_name = $request['first_name'] ? $request['first_name'] : $user->first_name;
            $user->last_name = $request['last_name'] ? $request['last_name'] : $user->last_name;
            $user->email = $request['email'] ? $request['email'] : $user->email;
            $user->save();

        } catch (\Exception $e) {

            return $this->dispatch(new HandleErrorCommand($e->getMessage()));
        }


        return $this->dispatch(new HandleResponseCommand('Settings changed.', $user));

    }

    private function changePassword($request)
    {
        $userId = $this->auth->id();
        $user = $this->user->find($userId);
        try {
            $validation = $this->auth->validate(['username' => $user->username, 'password' => $request['currentpassword']]);
            if ($validation) {
                $user->password = \Hash::make($request['newpassword']);
                $user->save();
                return $this->dispatch(new HandleResponseCommand('Password changed.'));
            }else{
                return $this->dispatch(new HandleErrorCommand('Your current password is invalid'));
            }
        } catch (\Exception $e) {
            return $this->dispatch(new HandleErrorCommand($e->getMessage()));
        }
    }
} 