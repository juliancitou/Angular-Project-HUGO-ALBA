<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('is_active', true)
            ->select('id', 'name', 'description', 'image', 'is_active')
            ->get();

        return response()->json($categories);
    }
}
