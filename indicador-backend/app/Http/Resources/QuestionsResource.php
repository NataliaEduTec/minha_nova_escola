<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionsResource extends JsonResource
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
            'description' => $this->description,
            'content' => $this->description,
            'indicator_id' => $this->indicator_id,
            'created_by_user' => $this->created_by_user,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'alternatives' => AlternativesResource::collection($this->whenLoaded('alternatives')),
        ];
    }
}
