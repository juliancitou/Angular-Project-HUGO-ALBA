<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240'
        ]);

        try {
            // Guardar imagen en storage/app/public/images
            $path = $request->file('image')->store('images', 'public');

            // Obtener URL pública - FORMA CORRECTA
            $url = asset('storage/' . str_replace('public/', '', $path));

            return response()->json([
                'success' => true,
                'url' => $url,
                'path' => $path,
                'file_name' => $request->file('image')->getClientOriginalName()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function delete(Request $request): JsonResponse
    {
        $request->validate([
            'path' => 'required|string'
        ]);

        try {
            // Eliminar imagen
            $deleted = Storage::disk('public')->delete($request->path);

            return response()->json([
                'success' => $deleted,
                'message' => $deleted ? 'Imagen eliminada correctamente' : 'No se pudo eliminar la imagen'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
