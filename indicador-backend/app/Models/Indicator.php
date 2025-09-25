<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Indicator extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['code', 'description', 'user_id', 'active', 'type'];

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

    public function questions()
    {
        return $this->hasMany(Questions::class, 'indicator_id');
    }

    public function disciplineIndicators(): HasMany
    {
        return $this->hasMany(DisciplineIndicator::class);
    }

    public function seriesIndicators(): HasMany
    {
        return $this->hasMany(SeriesIndicator::class);
    }
}
