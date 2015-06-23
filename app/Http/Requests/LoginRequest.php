<?php namespace OwnDrive\Http\Requests;

use OwnDrive\Http\Requests\Request;

class LoginRequest extends Request {

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
			'username' => 'required',
            'password' => 'required'
		];
	}

  /*  public function response(array $errors)
    {
        return \Response::json([
            'status' => 'error',
            'message' => 'Invalid input'
        ],400);
    }*/

}
