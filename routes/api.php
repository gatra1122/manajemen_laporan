<?php

use App\Http\Controllers\API\AuthController as Auth;
use App\Http\Controllers\Api\UserController as User;
use App\Http\Controllers\Api\BarangController as Barang;
use App\Http\Controllers\Api\KategoriController  as Kategori;
use App\Http\Controllers\api\KategoriLaporanController;
use App\Http\Controllers\api\LaporanController;
use App\Http\Controllers\api\PelaporController;
use App\Http\Controllers\Api\SupplierController as Supplier;
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

// Public routes
Route::post('register', [Auth::class, 'register']);
Route::post('login', [Auth::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth routes
    Route::controller(Auth::class)->group(function () {
        Route::post('logout', 'logout');
        Route::get('me', 'me');
    });

    // Users routes
    Route::controller(User::class)->group(function () {
        Route::get('user', 'index');
        Route::get('user/{id}', 'show');
        Route::post('user', 'store');
        Route::put('user/{id}', 'update');
        Route::delete('user/{id}', 'destroy');
    });
    Route::get('kategori_laporan/list', [KategoriLaporanController::class, 'list']);
    Route::resource('kategori_laporan', KategoriLaporanController::class);
    Route::get('pelapor/list', [PelaporController::class, 'list']);
    Route::resource('pelapor', PelaporController::class);
    Route::resource('laporan', LaporanController::class);
});
