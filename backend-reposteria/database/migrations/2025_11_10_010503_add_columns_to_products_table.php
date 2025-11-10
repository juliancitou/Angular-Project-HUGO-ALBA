<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('name');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->string('category');
            $table->integer('stock')->default(0);
            $table->boolean('is_available')->default(true);
            $table->json('images')->nullable();
            $table->softDeletes();
            
            // Índices para mejor performance
            $table->index(['category', 'is_available']);
            $table->index(['price']);
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'name', 'description', 'price', 'category', 
                'stock', 'is_available', 'images', 'deleted_at'
            ]);
            $table->dropIndex(['category_is_available_index']);
            $table->dropIndex(['price_index']);
        });
    }
};