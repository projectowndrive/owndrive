<?php namespace OwnDrive;

use Illuminate\Database\Eloquent\Model;

class File extends Model {

	protected $guarded = ['id'];

    public function owner()
    {
        return $this->belongsTo('OwnDrive\User','owner_id');
    }

    public function isOwnerID($userId)
    {
        if($this->owner_id == $userId) {
            return true;
        } else {
            return false;
        }
    }

    public function user(){
        return $this->hasOne('OwnDrive\User','owner_id');
    }

    public function sharedWith(){
        return $this->belongsToMany('OwnDrive\User', null, 'file_id')->withPivot('user_id')->withTimestamps();
    }

    public function scopeUsersFiles($query, $userId){
        return $query->whereOwner_id($userId);
    }

}
