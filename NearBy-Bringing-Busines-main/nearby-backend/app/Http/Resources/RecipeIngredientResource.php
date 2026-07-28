<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeIngredientResource extends JsonResource
{
    /**
     * Shape matches the frontend `RecipeIngredient` type (camelCase).
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'qty' => (float) $this->qty,
            'unit' => $this->unit,
            'weightGrams' => (float) $this->weight_grams,
            'price' => (float) $this->price,
        ];
    }
}
