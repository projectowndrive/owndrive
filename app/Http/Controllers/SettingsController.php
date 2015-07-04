<?php namespace OwnDrive\Http\Controllers;

use OwnDrive\Http\Controllers\Controller;

use Illuminate\Http\Request;
use OwnDrive\Services\SettingsService;


class SettingsController extends Controller
{

    /**
     * @var SettingsService
     */
    private $settingsService;

    function __construct(SettingsService $settingsService)
    {
        $this->settingsService = $settingsService;
    }


    /**
     * Display a listing of the resource.
     *
     * @param $resource
     * @return Response
     */
    public function settingResourceProvider($resource)
    {
        return $this->settingsService->settingResourceProvider($resource);
    }

    public function getSettings($settingName)
    {
        return $this->settingsService->settingsProvider($settingName);
    }

    public function saveSettings($settingName, Request $request)
    {

        if ($settingName === 'newpassword') {
            $validator = \Validator::make($request->all(), [
                'currentpassword' => 'required',
                'newpassword' => 'required',
                'verifiedpassword' => 'required|same:newpassword',
            ]);
        } elseif ($settingName === 'profilepic') {
            $validator = \Validator::make($request->all(), [
                'image' => 'image'
                ]);

        } elseif ($settingName === 'profilesettings') {
            $validator = \Validator::make($request->all(), [
                'first_name' => 'required|string',
                'last_name' => 'required|string',
                'email' => 'required|email',
            ]);
        }

        if ($validator->fails()) {
            return \Response::make($validator->messages(),422);
        }


        return $this->settingsService->saveSettings($settingName, $request->all());
    }

}