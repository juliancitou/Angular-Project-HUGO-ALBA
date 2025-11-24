<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->available()->get();
        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with('category')->find($id);
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

    // ==================== CREAR PRODUCTO (ADMIN) ====================

    // ==================== CREAR PRODUCTO (ADMIN) ====================
    // ← PÉGALO DENTRO DE ProductController.php, reemplazando el método store actual
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0.01',
            'category_id' => 'required|exists:categories,id',
            'stock'       => 'required|integer|min:0',
            'is_available' => 'sometimes|boolean',
            'images.*'    => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120'
        ]);

        $imagePaths = [];

        try {
            DB::beginTransaction();

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $filename = Str::random(32) . '.' . $image->getClientOriginalExtension();
                    $path = $image->storeAs('products', $filename, 'public');
                    $imagePaths[] = $path;
                }
            }

            $product = Product::create([
                'name'         => $request->name,
                'description'  => $request->description ?? '',
                'price'        => $request->price,
                'category_id'  => $request->category_id,
                'category'     => $request->category_id,
                'stock'        => $request->stock,
                'is_available' => $request->boolean('is_available', true),
                'images'       => $imagePaths
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Producto creado exitosamente',
                'product' => $product
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            foreach ($imagePaths as $path) {
                Storage::disk('public')->delete($path);
            }

            return response()->json([
                'success' => false,
                'message' => 'Error al crear producto: ' . $e->getMessage(),
            ], 500);
        }
    }
    // ==================== ACTUALIZAR PRODUCTO (ADMIN) ====================
    public function update(Request $request, $id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Producto no encontrado'], 404);
        }

        $request->validate([
            'name'         => 'sometimes|required|string|max:255',
            'description'  => 'nullable|string',
            'price'        => 'sometimes|required|numeric|min:0.01',
            'category_id'  => 'sometimes|required|exists:categories,id',
            'stock'        => 'sometimes|required|integer|min:0',
            'is_available' => 'sometimes|boolean',
            'images.*'     => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120'
        ]);

        try {
            $imagePaths = $product->images ?? [];

            if ($request->hasFile('images')) {
                // Opcional: borrar imágenes anteriores si quieres reemplazar todas
                foreach ($imagePaths as $oldPath) {
                    Storage::disk('public')->delete($oldPath);
                }
                $imagePaths = [];

                foreach ($request->file('images') as $image) {
                    $filename = Str::random(32) . '.' . $image->getClientOriginalExtension();
                    $path = $image->storeAs('products', $filename, 'public');
                    $imagePaths[] = $path;
                }
            }

            $product->update([
                'name'         => $request->name ?? $product->name,
                'description'  => $request->description ?? $product->description,
                'price'        => $request->price ?? $product->price,
                'category_id'  => $request->category_id ?? $product->category_id,
                'category'     => $request->category_id ?? $product->category,
                'stock'        => $request->stock ?? $product->stock,
                'is_available' => $request->has('is_available') ? $request->boolean('is_available') : $product->is_available,
                'images'       => $imagePaths
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Producto actualizado exitosamente',
                'product' => $product->fresh()->load('category')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    // ==================== ELIMINAR PRODUCTO (ADMIN) ====================
    public function destroy($id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Producto no encontrado'], 404);
        }

        try {
            // BORRAR TODAS LAS IMÁGENES DEL DISCO
            if ($product->images && is_array($product->images)) {
                foreach ($product->images as $imagePath) {
                    Storage::disk('public')->delete($imagePath);
                }
            }

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Producto y sus imágenes eliminadas correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el producto',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
