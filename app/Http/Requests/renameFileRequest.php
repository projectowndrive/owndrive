<?php namespace OwnDrive\Http\Requests;


use Illuminate\Contracts\Auth\Guard;
use OwnDrive\File;
use OwnDrive\Http\Requests\Request;

class RenameFileRequest extends Request {

    /**
     * Determine if the user is authorized to make this request.
     *
     * @param File $file
     * @param Auth $auth
     * @return bool
     */
	public function authorize(File $file, Guard $auth)
	{
		return $file->where('id', $this->input('fileId'))->where('owner_id', $auth->id())->exists();
    }

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		return [
			'fileId' => 'required|exists:files,id',
            'newName' => 'required'
		];
	}

}
