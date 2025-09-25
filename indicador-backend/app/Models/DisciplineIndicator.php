<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use \Illuminate\Database\Eloquent\Relations\HasMany;

class DisciplineIndicator extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['discipline_id', 'created_by_user', 'indicator_id', 'active'];

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

    public function indicators(): HasMany
    {
        return $this->hasMany(Indicator::class, 'indicator_id');
    }
}
