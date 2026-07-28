<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeResource extends JsonResource
{
    /**
     * Shape matches the frontend `Recipe` type (camelCase), mengikuti pola
     * UmkmResource yang me-rename kolom snake_case dari database.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'umkmId' => $this->umkm_id,
            'name' => $this->name,
            'category' => $this->category,
            'storage' => $this->storage,

            'totalWeightGrams' => (float) $this->total_weight_grams,
            'servingWeightGrams' => (float) $this->serving_weight_grams,
            'yieldServings' => (int) $this->yield_servings,
            'totalCost' => (float) $this->total_cost,
            'costPerServing' => (float) $this->cost_per_serving,

            'marginPercent' => (int) $this->margin_percent,
            'suggestedPrice' => (float) $this->suggested_price,
            'profitPerServing' => round((float) $this->suggested_price - (float) $this->cost_per_serving, 2),

            'shelfLifeHours' => $this->shelf_life_hours !== null ? (int) $this->shelf_life_hours : null,
            'shelfLifeNote' => $this->shelf_life_note,

            'ingredients' => RecipeIngredientResource::collection($this->whenLoaded('ingredients')),

            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
