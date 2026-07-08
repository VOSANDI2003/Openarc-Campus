<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lecturer extends Model
{
    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'lecturer_id',
        'full_name',
        'email',
        'contact',
        'subject',
    ];

    // ── Relationships ──────────────────────────────────────────────────────────

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}