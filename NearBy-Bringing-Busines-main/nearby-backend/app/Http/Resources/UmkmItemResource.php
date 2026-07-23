<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UmkmItemResource extends JsonResource
{
    /**
     * Shape matches the frontend `UmkmItem` type.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'price' => $this->price,
            'img' => $this->img,
            'avail' => (bool) $this->available,
        ];
    }
}
