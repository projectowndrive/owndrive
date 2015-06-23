<?php namespace OwnDrive\Http\Controllers;

use OwnDrive\Http\Controllers\Controller;

use Illuminate\Http\Request;
use OwnDrive\Services\SettingsService;


class SettingsController extends Controller {

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
     * @param Request $request
     * @return Response
     */
    public function settingResourceProvider(Request $request)
    {
        return $this->settingsService->settingResourceProvider($request->input('resource'));
    }

}