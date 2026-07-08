<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuperAdmin extends Model
{
    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'employee_id',
        'full_name',
        'email',
        'access_level',
    ];

    // ── Relationships ──────────────────────────────────────────────────────────

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}