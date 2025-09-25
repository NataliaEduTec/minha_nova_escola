<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class DiagnosticUpdated extends Model
{
    protected $table = 'diagnostic_updated';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;

    protected $fillable = [
        'diagnostic_id',
        'user_id',
        'updated_at'
    ];

    public function diagnostic()
    {
        return $this->belongsTo(Diagnostic::class, 'diagnostic_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}