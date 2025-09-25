<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Alternatives extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['description', 'created_by_user', 'question_id', 'is_correct'];

    protected static function booted(): void
    {
        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Questions::class, 'question_id');
    }
}
