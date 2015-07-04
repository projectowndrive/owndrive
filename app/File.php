<?php namespace OwnDrive;

use Illuminate\Database\Eloquent\Model;
use Nicolaslopezj\Searchable\SearchableTrait;

class File extends Model {

    use SearchableTrait;

	protected $guarded = ['id'];

    protected $searchable = [
        'columns' => [
            'name' => 1,
        ],

       /* 'joins' => [
            'users' => ['files.owner_id', 'users.id'],
        ],*/
    ];

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
