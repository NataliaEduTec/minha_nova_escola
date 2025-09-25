<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiagnosticStudent extends Model
{
    protected $table = 'diagnostic_student';

    protected $fillable = [
        'diagnostic_id',
        'student_id',
        'question_1_answer',
        'question_2_answer',
        'question_3_answer',
        'question_4_answer',
        'question_5_answer',
        'question_6_answer',
        'question_7_answer',
        'question_8_answer',
        'question_9_answer',
        'question_10_answer',
        'question_11_answer',
        'question_12_answer',
        'question_13_answer',
        'question_14_answer',
        'question_15_answer',
        'question_16_answer',
        'question_17_answer',
        'question_18_answer',
        'question_19_answer',
        'question_20_answer',
        'question_21_answer',
        'question_22_answer',
        'question_23_answer',
        'question_24_answer',
        'question_25_answer',
        'tabulated',
        'a_e_e',
        'created_by'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }

    public function diagnostic(): BelongsTo
    {
        return $this->belongsTo(Diagnostic::class, 'diagnostic_id');
    }
}
