<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use \Illuminate\Database\Eloquent\Relations\HasMany;

class SeriesIndicator extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['series_id', 'indicator_id', 'created_by_user', 'active'];

    protected static function booted(): void
    {
        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }

    public function indicator(): HasMany
    {
        return $this->hasMany(Indicator::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user');
    }
}
