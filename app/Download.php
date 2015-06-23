<?php namespace OwnDrive;

use Illuminate\Database\Eloquent\Model;

class Download extends Model {

    protected $guarded = ['id'];

    protected $fillable = ['file_id', 'key'];
}
