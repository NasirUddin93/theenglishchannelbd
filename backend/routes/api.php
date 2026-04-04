<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\AboutController;

Route::get('/test', function () {
    return response()->json(['message' => 'Lumina Books API is running!']);
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::prefix('books')->group(function () {
    Route::get('/', [BookController::class, 'index']);
    Route::get('/{id}', [BookController::class, 'show']);
    Route::get('/{id}/reviews', [ReviewController::class, 'index']);
    Route::post('/{id}/reviews', [ReviewController::class, 'store']);
    Route::get('/{id}/questions', [QuestionController::class, 'index']);
    Route::post('/{id}/questions', [QuestionController::class, 'store']);
});

Route::get('/categories', [BookController::class, 'categories']);

Route::get('/about', [AboutController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('staff')->group(function () {
        Route::put('/questions/{id}/answer', [QuestionController::class, 'answer']);
    });

    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::post('/update-profile', [AuthController::class, 'updateProfile']);
    });

    Route::post('/about', [AboutController::class, 'update']);

    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/add', [CartController::class, 'add']);
        Route::post('/update', [CartController::class, 'update']);
        Route::delete('/{bookId}', [CartController::class, 'remove']);
        Route::delete('/', [CartController::class, 'clear']);
    });

    Route::prefix('wishlist')->group(function () {
        Route::get('/', [WishlistController::class, 'index']);
        Route::post('/toggle', [WishlistController::class, 'toggle']);
        Route::get('/check', [WishlistController::class, 'check']);
        Route::get('/check-batch', [WishlistController::class, 'checkBatch']);
    });

    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/{id}', [OrderController::class, 'show']);
    });

    Route::prefix('staff')->group(function () {
        Route::get('/dashboard', [StaffController::class, 'dashboard']);
        Route::get('/orders', [StaffController::class, 'orders']);
        Route::put('/orders/{id}', [StaffController::class, 'updateOrderStatus']);
        Route::get('/books', [StaffController::class, 'books']);
        Route::post('/books', [StaffController::class, 'storeBook']);
        Route::put('/books/{id}', [StaffController::class, 'updateBook']);
        Route::delete('/books/{id}', [StaffController::class, 'deleteBook']);
        Route::post('/books/upload-cover', [StaffController::class, 'uploadCover']);
        Route::post('/categories', [StaffController::class, 'storeCategory']);
        Route::delete('/categories/{id}', [StaffController::class, 'deleteCategory']);
        Route::get('/all-questions', [StaffController::class, 'allQuestions']);
    });
});
