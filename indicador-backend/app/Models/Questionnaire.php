<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Questionnaire extends Model
{
    protected $table = 'questionnaire';
    protected $fillable = [
        'diagnostic_id',
        'name',
        'content',
        'created_by',
        'created_at',
        'updated_at'
    ];

    public $incrementing = false;
    protected $keyType = 'string';
    protected static function booted()
    {
        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function diagnostics()
    {
        return $this->hasMany(Diagnostic::class);
    }
}
