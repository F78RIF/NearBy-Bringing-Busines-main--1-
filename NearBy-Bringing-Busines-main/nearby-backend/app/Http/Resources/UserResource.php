<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $labels = [
            'user' => 'Pengguna',
            'owner' => 'Pemilik UMKM',
            'admin' => 'Administrator',
        ];

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role,
            'roleLabel' => $labels[$this->role] ?? 'Pengguna',
            'status' => $this->status,
            'initial' => Str::upper(Str::substr(trim($this->name), 0, 1)),
            'joined' => $this->created_at?->translatedFormat('j M Y'),
        ];
    }
}
