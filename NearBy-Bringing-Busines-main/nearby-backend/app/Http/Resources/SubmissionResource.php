<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubmissionResource extends JsonResource
{
    /**
     * Shape matches the frontend `SubmissionRaw` type.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'umkmId' => $this->umkm_id,
            'name' => $this->name,
            'owner' => $this->owner_name ?? $this->owner?->name ?? 'Belum diisi',
            'cat' => $this->category,
            'loc' => $this->location,
            'status' => $this->status,
            'date' => $this->created_at?->translatedFormat('j M Y'),
            'checks' => $this->checks ?? [],
            'files' => $this->files ?? [],
        ];
    }
}
