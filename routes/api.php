<?php

use App\Models\Kategori;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post("/kategori",function () {
    $data = Kategori::latest()->get();
    return response()->json($data);
});

Route::post("/product",function (Request $request) {
    if($request->query("find") === "all"){
        $data = Product::latest()->paginate(20);
        return response()->json($data);
    }
    $data = Product::with("Variant")->find($request->query("find"));
    return  response()->json($data);
});
