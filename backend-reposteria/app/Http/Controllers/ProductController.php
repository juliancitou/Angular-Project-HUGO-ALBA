<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::available()->get();
        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        return response()->json($product);
    }

    public function byCategory($category)
    {
        $products = Product::where('category', $category)
            ->available()
            ->get();

        return response()->json($products);
    }

    // CREAR NUEVO PRODUCTO (para admin)
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:100',
            'stock' => 'required|integer|min:0',
            'image_url' => 'required|string', // URL de la imagen subida previamente
            'is_available' => 'boolean'
        ]);

        try {
            $product = Product::create([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'category' => $request->category,
                'stock' => $request->stock,
                'image_url' => $request->image_url,
                'is_available' => $request->is_available ?? true
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Producto creado exitosamente',
                'product' => $product
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ACTUALIZAR PRODUCTO (para admin)
    public function update(Request $request, $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado'
            ], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'category' => 'sometimes|string|max:100',
            'stock' => 'sometimes|integer|min:0',
            'image_url' => 'sometimes|string', // Nueva imagen (opcional en update)
            'is_available' => 'sometimes|boolean'
        ]);

        try {
            $product->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Producto actualizado exitosamente',
                'product' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ELIMINAR PRODUCTO (para admin)
    public function destroy($id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado'
            ], 404);
        }

        try {
            // Opcional: Eliminar la imagen del storage si quieres
            // if ($product->image_url) {
            //     // Lógica para eliminar imagen...
            // }

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Producto eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
