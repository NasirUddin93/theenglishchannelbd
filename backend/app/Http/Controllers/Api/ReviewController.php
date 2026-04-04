<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index($bookId)
    {
        $reviews = Review::where('book_id', $bookId)
            ->where('is_approved', true)
            ->orderBy('created_at', 'desc')
            ->get();

        $averageRating = $reviews->avg('rating') ?? 0;

        return response()->json([
            'reviews' => $reviews,
            'average_rating' => round($averageRating, 1),
            'total' => $reviews->count(),
        ]);
    }

    public function store(Request $request, $bookId)
    {
        $validated = $request->validate([
            'user_name' => 'required|string|max:255',
            'user_email' => 'nullable|email|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:2000',
        ]);

        $review = Review::create([
            'book_id' => $bookId,
            'user_id' => $request->user()?->id,
            'user_name' => $validated['user_name'],
            'user_email' => $validated['user_email'] ?? null,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'is_approved' => true,
        ]);

        return response()->json([
            'review' => $review,
            'message' => 'Review submitted successfully',
        ], 201);
    }
}
