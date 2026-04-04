<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $perPage = 20;
        $orders = $request->user()->orders()
            ->select('id', 'user_id', 'total', 'status', 'payment_method', 'shipping_address', 'city', 'state', 'postal_code', 'phone', 'notes', 'created_at', 'updated_at')
            ->with(['items' => function($query) {
                $query->select('id', 'order_id', 'book_id', 'quantity', 'price');
            }, 'items.book' => function($query) {
                $query->select('id', 'title', 'author', 'price', 'image');
            }])
            ->orderBy('created_at', 'desc')
            ->limit($perPage)
            ->get();

        foreach ($orders as $order) {
            foreach ($order->items as $item) {
                if ($item->book && $item->book->image) {
                    if (!preg_match('#^https?://#i', $item->book->image)) {
                        $item->book->image = asset('storage/' . ltrim($item->book->image, '/'));
                    }
                }
            }
        }

        return response()->json($orders)->header('Cache-Control', 'public, max-age=60');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'shipping_address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'phone' => 'required|string|max:20',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string|max:1000',
        ]);

        $cart = $request->session()->get('cart', []);

        if (empty($cart)) {
            return response()->json([
                'message' => 'Cart is empty',
            ], 400);
        }

        try {
            DB::beginTransaction();

            $total = 0;
            $orderItems = [];

            foreach ($cart as $bookId => $quantity) {
                $book = Book::lockForUpdate()->find($bookId);

                if (!$book) {
                    throw new \Exception("Book not found: {$bookId}");
                }

                if ($book->stock < $quantity) {
                    throw new \Exception("Not enough stock for: {$book->title}");
                }

                $subtotal = $book->price * $quantity;
                $total += $subtotal;

                $orderItems[] = [
                    'book_id' => $bookId,
                    'quantity' => $quantity,
                    'price' => $book->price,
                ];

                $book->decrement('stock', $quantity);
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'total' => $total,
                'status' => 'pending',
                'payment_method' => $validated['payment_method'],
                'shipping_address' => $validated['shipping_address'],
                'city' => $validated['city'],
                'state' => $validated['state'] ?? null,
                'postal_code' => $validated['postal_code'] ?? null,
                'phone' => $validated['phone'],
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($orderItems as $item) {
                $item['order_id'] = $order->id;
                OrderItem::create($item);
            }

            $request->session()->forget('cart');

            DB::commit();

            return response()->json([
                'order' => $order->load('items.book'),
                'message' => 'Order placed successfully',
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function show(Request $request, $id)
    {
        $order = $request->user()->orders()
            ->with('items.book')
            ->findOrFail($id);

        return response()->json($order);
    }
}
