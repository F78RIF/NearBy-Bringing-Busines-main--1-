<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'umkm_id', 'owner_id', 'name', 'owner_name', 'category',
    'location', 'status', 'checks', 'files',
])]
class Submission extends Model
{
    protected function casts(): array
    {
        return [
            'checks' => 'array',
            'files' => 'array',
        ];
    }

    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
