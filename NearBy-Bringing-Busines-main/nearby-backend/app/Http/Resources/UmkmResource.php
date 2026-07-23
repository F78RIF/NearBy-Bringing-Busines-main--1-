<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UmkmResource extends JsonResource
{
    /**
     * Shape matches the frontend `Umkm` type (cat/loc/reviews naming).
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'cat' => $this->category,
            'loc' => $this->location,
            'rating' => (float) $this->rating,
            'reviews' => (int) $this->reviews_count,
            'priceLabel' => $this->price_label,
            'tag' => $this->tag,
            'imgLabel' => $this->img_label,
            'address' => $this->address,
            'hours' => $this->hours,
            'phone' => $this->phone,
            'ig' => $this->ig,
            'listLabel' => $this->list_label,
            'status' => $this->status,
            'verification' => $this->verification,
            'views' => (int) $this->views,
            'items' => UmkmItemResource::collection($this->whenLoaded('items')),
            'reviewsList' => ReviewResource::collection($this->whenLoaded('reviews')),
            'isFavorite' => $this->when(isset($this->is_favorite), fn () => (bool) $this->is_favorite),
        ];
    }
}
