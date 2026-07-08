<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FrontDesk extends Model
{
    protected $primaryKey = 'id';
    protected $table = 'frontdesks'; // add this line

    protected $fillable = [
        'user_id',
        'fd_id',
        'full_name',
        'email',
        'contact',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}