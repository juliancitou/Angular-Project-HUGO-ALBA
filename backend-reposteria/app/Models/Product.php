<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description', 
        'price',
        'category',
        'stock',
        'images',
        'is_available'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
        'is_available' => 'boolean',
        'images' => 'array' // PostgreSQL maneja JSON nativamente
    ];

    // Scope para productos disponibles
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true)
                    ->where('stock', '>', 0);
    }

    // Scope para búsqueda por categoría
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}