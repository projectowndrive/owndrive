<?php namespace OwnDrive\Http\Requests;

use OwnDrive\Http\Requests\Request;

class MoveFileRequest extends Request {

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
			'fileId' => 'required',
            'newPath' => 'required'
		];
	}

}
