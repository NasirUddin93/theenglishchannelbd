<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = $request->session()->get('cart', []);

        $cartItems = [];
        $total = 0;

        foreach ($cart as $bookId => $quantity) {
            $book = Book::find($bookId);
            if ($book) {
                $subtotal = $book->price * $quantity;
                $cartItems[] = [
                    'book' => $book,
                    'quantity' => $quantity,
                    'subtotal' => $subtotal,
                ];
                $total += $subtotal;
            }
        }

        return response()->json([
            'items' => $cartItems,
            'total' => $total,
            'count' => count($cartItems),
        ]);
    }

    public function add(Request $request)
    {
        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $book = Book::findOrFail($validated['book_id']);

        if ($book->stock < $validated['quantity']) {
            return response()->json([
                'message' => 'Not enough stock available',
            ], 400);
        }

        $cart = $request->session()->get('cart', []);
        $bookId = $validated['book_id'];

        if (isset($cart[$bookId])) {
            $cart[$bookId] += $validated['quantity'];
        } else {
            $cart[$bookId] = $validated['quantity'];
        }

        $request->session()->put('cart', $cart);

        return response()->json([
            'message' => 'Item added to cart',
            'cart_count' => count($cart),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'book_id' => 'required|integer',
            'quantity' => 'required|integer|min:0',
        ]);

        $cart = $request->session()->get('cart', []);
        $bookId = $validated['book_id'];

        if ($validated['quantity'] === 0) {
            unset($cart[$bookId]);
        } else {
            $cart[$bookId] = $validated['quantity'];
        }

        $request->session()->put('cart', $cart);

        return response()->json([
            'message' => 'Cart updated',
        ]);
    }

    public function remove(Request $request, $bookId)
    {
        $cart = $request->session()->get('cart', []);

        if (isset($cart[$bookId])) {
            unset($cart[$bookId]);
            $request->session()->put('cart', $cart);
        }

        return response()->json([
            'message' => 'Item removed from cart',
        ]);
    }

    public function clear(Request $request)
    {
        $request->session()->forget('cart');

        return response()->json([
            'message' => 'Cart cleared',
        ]);
    }
}
