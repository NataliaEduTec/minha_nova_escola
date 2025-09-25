<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Diagnostic extends Model
{
    protected $table = 'diagnostic';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'institution_id',
        'series_id',
        'class_id',
        'discipline_id',
        'schoolYear',
        'quantity_questions',
        'name',
        'created_by',
        'created_at',
        'updated_at',
        'active',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function questionnaire()
    {
        return $this->hasMany(Questionnaire::class);
    }

    public function diagnosticStudents()
    {
        return $this->hasMany(DiagnosticStudent::class, 'diagnostic_id');
    }

    public function diagnosticUpdated()
    {
        return $this->hasMany(DiagnosticUpdated::class, 'diagnostic_id');
    }
}
