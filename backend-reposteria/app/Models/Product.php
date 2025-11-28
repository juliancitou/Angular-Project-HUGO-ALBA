<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'price',
        'category',
        'category_id',
        'stock',
        'images',
        'is_available'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
        'is_available' => 'boolean',
        'images' => 'array'
    ];

    // RELACIÓN CON CATEGORÍA
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    // SCOPES
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true)
            ->where('stock', '>', 0);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // RELACIÓN DE LIKES
    public function likes()
    {
        return $this->belongsToMany(User::class, 'product_likes');
    }

    public function likesCount()
    {
        return $this->likes()->count();
    }

    public function isLikedBy(User $user)
    {
        return $this->likes()->where('user_id', $user->id)->exists();
    }

    // ✅ ACCESSORS (SIN $appends para evitar conflictos)
    public function getCategoryNameAttribute()
    {
        // Si la relación está cargada
        if ($this->relationLoaded('category') && $this->category) {
            return $this->category->name;
        }

        // Si ya tiene nombre como texto
        if (!is_numeric($this->category) && $this->category) {
            return $this->category;
        }

        // Fallback
        return 'Sin categoría';
    }

    public function getCategoryObjAttribute()
    {
        if ($this->relationLoaded('category') && $this->category) {
            return [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'description' => $this->category->description,
                'image' => $this->category->image,
                'is_active' => $this->category->is_active
            ];
        }
        return null;
    }

    public function getImageUrlsAttribute()
    {
        if (!$this->images || empty($this->images)) {
            return [];
        }

        return collect($this->images)->map(function ($image) {
            if (Str::startsWith($image, 'http')) {
                return $image;
            }
            return asset('storage/' . $image);
        })->toArray();
    }

    public function getFirstImageUrlAttribute()
    {
        $urls = $this->image_urls;
        return $urls[0] ?? null;
    }
}
