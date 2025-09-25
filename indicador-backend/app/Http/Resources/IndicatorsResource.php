<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IndicatorsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'description' => $this->description,
            'user_id' => $this->user_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'type' => $this->type,
            'series' => $this->seriesIndicators->map(function ($series) {
                return [
                    'primary' => $series->id,
                    'id' => $series->series_id,
                    'created_by_user' => $series->created_by_user,
                    'active' => $series->active,
                ];
            }),
            'disciplines' => $this->disciplineIndicators->map(function ($discipline) {
                return [
                    'primary' => $discipline->id,
                    'id' => $discipline->discipline_id,
                    'created_by_user' => $discipline->created_by_user,
                    'active' => $discipline->active,
                ];
            }),
        ];
    }
}
