<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\Admin\UserAdminController;
use App\Http\Controllers\CategoryController;

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
Route::get('/products',       [ProductController::class, 'index']);
Route::get('/products/{id}',  [ProductController::class, 'show']);

// Categorías (solo lectura para todos)
Route::get('/categories', [CategoryController::class, 'index']);

// ==================== RUTAS PROTEGIDAS (solo usuarios logueados) ====================
Route::middleware('auth:sanctum')->group(function () {

    // Logout y obtener usuario actual
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user',    [AuthController::class, 'user']);

    // ==================== GESTIÓN DE PRODUCTOS (solo usuarios logueados) ====================
    // → Como solo los admins pueden entrar al panel, estas rutas están protegidas por el frontend
    Route::post('/products',              [ProductController::class, 'store']);    // Crear
    Route::put('/products/{id}',          [ProductController::class, 'update']);   // Editar
    Route::delete('/products/{id}',       [ProductController::class, 'destroy']);  // Eliminar

    // Gestión de imágenes (si las usas por separado)
    Route::post('/images/upload',  [ImageController::class, 'upload']);
    Route::delete('/images/delete', [ImageController::class, 'delete']);

    // ==================== SOLO ADMIN REAL (para cosas críticas) ====================
    Route::middleware('admin')->group(function () {
        // Gestión de administradores (esto SÍ requiere ser admin real)
        Route::get('/admin/users',  [UserAdminController::class, 'index']);
        Route::post('/admin/users', [UserAdminController::class, 'store']);
    });
});
