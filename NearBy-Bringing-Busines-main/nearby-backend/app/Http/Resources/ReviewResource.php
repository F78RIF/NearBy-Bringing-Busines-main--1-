<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class ReviewResource extends JsonResource
{
    /**
     * Shape matches the frontend `Review` type.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $name = $this->author_name ?? $this->user?->name ?? 'Pengguna';

        return [
            'id' => (string) $this->id,
            'umkmId' => $this->umkm_id,
            'initial' => Str::upper(Str::substr(trim($name), 0, 1)),
            'name' => $name,
            'stars' => (int) $this->stars,
            'date' => $this->created_at?->diffForHumans(),
            'text' => $this->text,
            'reply' => $this->reply,
        ];
    }
}
