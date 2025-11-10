<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->string('category');
            $table->integer('stock')->default(0);
            $table->boolean('is_available')->default(true);
            $table->json('images')->nullable(); // PostgreSQL maneja JSON nativamente
            $table->timestamps();
            $table->softDeletes(); // Para borrado lógico
            
            // Índices para mejor performance
            $table->index(['category', 'is_available']);
            $table->index(['price']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};