<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\Admin\UserAdminController;

// ==================== RUTA DE PRUEBA ====================
Route::get('/test', function () {
    return response()->json([
        'message' => '¡API de Repostería Encanto funcionando!',
        'status'  => 'success',
        'timestamp' => now()
    ]);
});

// ==================== RUTAS PÚBLICAS ====================

// Auth (registro y login)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Productos (solo lectura para todos)
Route::get('/products',        [ProductController::class, 'index']);
Route::get('/products/{id}',   [ProductController::class, 'show']);

// ==================== RUTAS PROTEGIDAS (auth:sanctum) ====================
Route::middleware('auth:sanctum')->group(function () {

    // Logout y obtener usuario actual
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user',    [AuthController::class, 'user']);

    // ==================== RUTAS SOLO ADMIN ====================
    Route::middleware('admin')->group(function () {

        // Gestión de administradores
        Route::get('/admin/users', [UserAdminController::class, 'index']);   // Listar admins
        Route::post('/admin/users', [UserAdminController::class, 'store']);  // Crear admin

        // Gestión completa de productos
        Route::post('/products',          [ProductController::class, 'store']);
        Route::put('/products/{id}',      [ProductController::class, 'update']);
        Route::delete('/products/{id}',   [ProductController::class, 'destroy']);

        // Gestión de imágenes
        Route::post('/images/upload', [ImageController::class, 'upload']);
        Route::delete('/images/delete', [ImageController::class, 'delete']);
    });
});
