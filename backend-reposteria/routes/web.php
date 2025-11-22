<?php

use Illuminate\Support\Facades\Route;

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

Route::get('/test-cloudinary', function () {
    try {
        // Probar subiendo una imagen de prueba
        $uploadResult = Cloudinary::upload('https://res.cloudinary.com/demo/image/upload/sample.jpg', [
            'folder' => 'reposteria-test'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Conexión exitosa con Cloudinary',
            'data' => [
                'url' => $uploadResult->getSecurePath(),
                'public_id' => $uploadResult->getPublicId(),
                'format' => $uploadResult->getExtension(),
                'size' => $uploadResult->getSize()
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Error en la conexión con Cloudinary',
            'error' => $e->getMessage()
        ], 500);
    }
});
