<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Book;
use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    public function dashboard()
    {
        $totalRevenue = Order::sum('total');
        $totalOrders = Order::count();
        $totalBooks = Book::count();
        $totalCustomers = User::where('role', 'customer')->count();
        $lowStockBooks = Book::where('stock', '<', 10)->count();

        $recentOrders = Order::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $ordersByStatus = Order::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get();

        $revenueByMonth = Order::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(total) as revenue')
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(6)
            ->get();

        return response()->json([
            'stats' => [
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'total_books' => $totalBooks,
                'total_customers' => $totalCustomers,
                'low_stock_books' => $lowStockBooks,
            ],
            'recent_orders' => $recentOrders,
            'orders_by_status' => $ordersByStatus,
            'revenue_by_month' => $revenueByMonth,
        ]);
    }

    public function orders()
    {
        $orders = Order::with(['user', 'items.book'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $orders->getCollection()->transform(function ($order) {
            foreach ($order->items as $item) {
                if ($item->book && $item->book->image) {
                    if (!preg_match('#^https?://#i', $item->book->image)) {
                        $item->book->image = asset('storage/' . ltrim($item->book->image, '/'));
                    }
                }
            }
            return $order;
        });

        return response()->json($orders);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $validated['status']]);

        return response()->json([
            'order' => $order,
            'message' => 'Order status updated',
        ]);
    }

    public function books()
    {
        $perPage = request()->query('per_page', 20);
        $page = request()->query('page', 1);
        $search = request()->query('search', '');
        $categories = request()->query('categories', []);
        $stockFilter = request()->query('stock_filter', 'all');
        $sort = request()->query('sort', 'created_at');
        $status = request()->query('status', '');

        $cacheKey = "staff_books_{$perPage}_{$page}_{$search}_{$stockFilter}_{$sort}_{$status}";
        
        if (!request()->has('no_cache') && cache()->has($cacheKey)) {
            return response()->json(cache()->get($cacheKey));
        }

        $query = Book::with('category');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%");
            });
        }

        if ($status && in_array($status, ['draft', 'approved'])) {
            $query->where('status', $status);
        }

        $categoriesParam = request()->query('categories', '');
        $categories = [];
        if ($categoriesParam) {
            $categories = is_array($categoriesParam) ? $categoriesParam : json_decode($categoriesParam, true) ?? [];
        }

        if (!empty($categories)) {
            $query->whereHas('category', function ($q) use ($categories) {
                $q->whereIn('name', $categories);
            });
        }

        if ($stockFilter === 'out') {
            $query->where('stock', 0);
        } elseif ($stockFilter === 'low') {
            $query->where('stock', '>', 0)->where('stock', '<', 10);
        } elseif ($stockFilter === 'in') {
            $query->where('stock', '>=', 10);
        }

        switch ($sort) {
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'title':
                $query->orderBy('title', 'asc');
                break;
            case 'stock-low':
                $query->orderBy('stock', 'asc');
                break;
            case 'stock-high':
                $query->orderBy('stock', 'desc');
                break;
            case 'price-low':
                $query->orderBy('price', 'asc');
                break;
            case 'price-high':
                $query->orderBy('price', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $books = $query->paginate((int) $perPage, ['*'], 'page', (int) $page);

        $response = response()->json($books);
        
        if (!request()->has('no_cache') && strlen(json_encode($books)) < 1000000) {
            cache()->put($cacheKey, $books, now()->addSeconds(30));
        }

        return $response;
    }

    public function storeBook(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category_id' => 'sometimes|exists:categories,id',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'image' => 'nullable|string',
            'isbn' => 'nullable|string',
            'publisher' => 'nullable|string',
            'pages' => 'nullable|integer',
            'language' => 'nullable|string',
            'is_featured' => 'sometimes|boolean',
            'status' => 'sometimes|string|in:draft,approved',
            'preview_content' => 'nullable|array',
            'preview_images' => 'nullable|array',
        ]);

        $validated['status'] = 'approved';

        $book = Book::create($validated);

        foreach (cache()->keys('staff_books_*') as $key) {
            cache()->forget($key);
        }

        return response()->json([
            'book' => $book,
            'message' => 'Book created successfully',
        ], 201);
    }

    public function updateBook(Request $request, $id)
    {
        $book = Book::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'author' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category_id' => 'sometimes|exists:categories,id',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'image' => 'nullable|string',
            'isbn' => 'nullable|string',
            'publisher' => 'nullable|string',
            'pages' => 'nullable|integer',
            'language' => 'nullable|string',
            'is_featured' => 'sometimes|boolean',
            'status' => 'sometimes|string|in:draft,approved',
            'preview_content' => 'nullable|array',
            'preview_images' => 'nullable|array',
        ]);

        $book->update($validated);

        foreach (cache()->keys('staff_books_*') as $key) {
            cache()->forget($key);
        }

        return response()->json([
            'book' => $book,
            'message' => 'Book updated successfully',
        ]);
    }

    public function deleteBook($id)
    {
        $book = Book::findOrFail($id);
        $book->delete();

        foreach (cache()->keys('staff_books_*') as $key) {
            cache()->forget($key);
        }

        return response()->json([
            'message' => 'Book deleted successfully',
        ]);
    }

    public function uploadCover(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp',
        ]);

        $path = $request->file('image')->store('book-covers', 'public');

        return response()->json([
            'path' => $path,
            'url' => asset('storage/' . $path),
            'message' => 'Cover uploaded successfully',
        ]);
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => \Str::slug($validated['name']),
        ]);

        return response()->json([
            'category' => $category,
            'message' => 'Category created successfully',
        ], 201);
    }

    public function deleteCategory($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully',
        ]);
    }

    public function allQuestions(Request $request)
    {
        $perPage = $request->query('per_page', 50);
        $page = $request->query('page', 1);

        $questions = \App\Models\Question::with(['book' => function($q) {
            $q->select('id', 'title', 'image');
        }])
            ->orderBy('created_at', 'desc')
            ->paginate((int) $perPage, ['*'], 'page', (int) $page);

        return response()->json($questions);
    }
}
