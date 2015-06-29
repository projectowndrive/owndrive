<?php namespace OwnDrive;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

class User extends Model implements AuthenticatableContract, CanResetPasswordContract {

	use Authenticatable, CanResetPassword;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['username', 'email', 'password'];

	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = ['password', 'remember_token'];

    public function files()
    {
        return $this->hasMany('OwnDrive\File','owner_id');
    }

    public function filesSharedWith(){
        return $this->belongsToMany('OwnDrive\File')->withPivot('user_id')->wherePivot('child', '=', '0');
    }

    public function allFilesSharedWith(){
        return $this->belongsToMany('OwnDrive\File')->withPivot('user_id');
    }

    public function listUsers(){
            return $this->select(array('id', 'username'));
    }
}
