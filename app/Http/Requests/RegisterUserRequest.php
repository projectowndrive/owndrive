<?php namespace OwnDrive\Http\Requests;

use OwnDrive\Http\Requests\Request;


class RegisterUserRequest extends Request {

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
            'first_name' => 'required',
            'username' => 'required|unique:users,username|max:100',
            'email' => 'required|unique:users,email|email|max:100',
            'password' => 'required|min:8|same:verifiedpassword',
            'verifiedpassword'=> 'required'
		];
	}

    public function response(array $errors)
    {
        return \Response::json([
           'status' => 'error',
            'message' => 'Invalid input',
            'errors' => $errors
        ],400);
    }

}
