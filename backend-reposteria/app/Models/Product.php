<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    // AÑADE 'category_id' AQUÍ
    protected $fillable = [
        'name',
        'description',
        'price',
        'category',      // lo mantienes por compatibilidad
        'category_id',   // ← ESTE ES EL QUE FALTABA
        'stock',
        'images',
        'is_available'
    ];

    protected $casts = [
        'price'        => 'decimal:2',
        'stock'        => 'integer',
        'is_available' => 'boolean',
        'images'       => 'array'
    ];

    public function scopeAvailable($query)
    {
        return $query->where('is_available', true)
            ->where('stock', '>', 0);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // Relación con categoría (opcional pero recomendado)
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
