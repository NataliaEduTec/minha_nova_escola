<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use \Illuminate\Database\Eloquent\Relations\HasMany;

class Questions extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['description', 'indicator_id', 'created_by_user', 'active', 'series_id', 'discipline_id'];

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

    public function indicator(): BelongsTo
    {
        return $this->belongsTo(DisciplineIndicator::class);
    }

    public function alternatives(): HasMany
    {
        return $this->hasMany(Alternatives::class, 'question_id');
    }
}
