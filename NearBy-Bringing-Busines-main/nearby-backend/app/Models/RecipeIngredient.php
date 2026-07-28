<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['recipe_id', 'name', 'qty', 'unit', 'weight_grams', 'price'])]
class RecipeIngredient extends Model
{
    protected function casts(): array
    {
        return [
            'qty' => 'float',
            'weight_grams' => 'float',
            'price' => 'float',
        ];
    }

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }
}
