<?php

use App\Http\Controllers\WarungController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get("/",[WarungController::class,"index"]);
Route::get("/home",[WarungController::class,"index"]);
Route::get("/home/{Product:id}/",[WarungController::class,"index"]);
Route::get("/variant/{Variant:id}/",[WarungController::class,"index"]);

Route::post("/home",[WarungController::class,"store"]);
Route::post("/home/{Product:id}",[WarungController::class,"storeVariant"]);
Route::delete("/home/{Product:id}",[WarungController::class,"destroy"]);
Route::put("/home/{Product:id}",[WarungController::class,"update"]);

Route::delete("/variant/{Variant:id}/",[WarungController::class,"destroyVariant"]);
