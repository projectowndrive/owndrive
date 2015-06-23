<?php namespace OwnDrive\Http\Requests;

use OwnDrive\Http\Requests\Request;

class CreateDirectoryRequest extends Request {

	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		return [
			'directoryName' => 'required',
            'path' => 'required_without:parentId|path:files,path,name,type,folder',
            'parentId' => 'required_without:path|exists:files,id,type,folder'
		];
	}

}
