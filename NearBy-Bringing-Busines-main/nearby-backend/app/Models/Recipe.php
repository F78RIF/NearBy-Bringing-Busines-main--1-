<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'owner_id', 'umkm_id', 'name', 'category', 'storage',
    'total_weight_grams', 'serving_weight_grams', 'yield_servings',
    'total_cost', 'cost_per_serving', 'margin_percent', 'suggested_price',
    'shelf_life_hours', 'shelf_life_note',
])]
class Recipe extends Model
{
    protected function casts(): array
    {
        return [
            'total_weight_grams' => 'float',
            'serving_weight_grams' => 'float',
            'yield_servings' => 'integer',
            'total_cost' => 'float',
            'cost_per_serving' => 'float',
            'margin_percent' => 'integer',
            'suggested_price' => 'float',
            'shelf_life_hours' => 'integer',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class);
    }

    public function ingredients(): HasMany
    {
        return $this->hasMany(RecipeIngredient::class);
    }
}
