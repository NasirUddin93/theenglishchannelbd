<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Course;
use App\Models\Book;
use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    public function dashboard()
    {
        try {
            $totalRevenue = Order::sum('total') ?? 0;
            $totalOrders = Order::count() ?? 0;
            $totalBooks = Book::count() ?? 0;
            $totalCustomers = User::where('role', 'customer')->count() ?? 0;
            $lowStockBooks = Book::where('stock', '<', 10)->count() ?? 0;
            
            // Additional book metrics
            $warehouseStock = Book::sum('stock') ?? 0;
            $bookCategories = Category::where('type', 'book')->count() ?? 0;
            
        // Courses overview data for staff dashboard
        $totalCourses = Course::count();
        // Count actual lessons from course_lessons table
        $totalVideos = \App\Models\CourseLesson::count();
        // Count course categories from categories table
        $courseCategories = Category::where('type', 'course')->count();
        // Course revenue from order_items linked to courses
        $courseRevenue = \App\Models\OrderItem::whereNotNull('course_id')->sum('price');
        $recentCourses = Course::orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'title', 'price', 'level', 'is_featured', 'created_at']);
    
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
                    'warehouse_stock' => $warehouseStock,
                    'book_categories' => $bookCategories,
                ],
                'recent_orders' => $recentOrders,
                'orders_by_status' => $ordersByStatus,
                'revenue_by_month' => $revenueByMonth,
                'courses' => [
                    'total' => $totalCourses,
                    'total_videos' => $totalVideos,
                    'categories' => $courseCategories,
                    'revenue' => $courseRevenue,
                    'recent' => $recentCourses,
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Dashboard error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
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
        $perPage = min((int) request()->query('per_page', 50), 200);
        $page = (int) request()->query('page', 1);
        $search = request()->query('search', '');
        $stockFilter = request()->query('stock_filter', 'all');
        $sort = request()->query('sort', 'created_at');
        $status = request()->query('status', '');

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

        $books = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($books);
    }

    public function batchBooks()
    {
        // Returns all books in a single response for batch operations
        $books = Book::with('category')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $books,
            'total' => $books->count(),
        ]);
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

        // Do not store large base64 image payloads in preview_images.
        // If preview_images is present, drop it to avoid bloating the DB row.
        if (isset($validated['preview_images'])) {
            unset($validated['preview_images']);
        }

        if (!empty($validated['image']) && str_starts_with($validated['image'], 'http')) {
            $parsed = parse_url($validated['image']);
            $pathParts = explode('/', ltrim($parsed['path'] ?? '', '/'));
            $storageIndex = array_search('storage', $pathParts);
            if ($storageIndex !== false) {
                $validated['image'] = implode('/', array_slice($pathParts, $storageIndex + 1));
            }
        }

        $book = Book::create($validated);

        // Clear staff books cache if the cache store supports key listing
        $cacheStore = cache()->getStore();
        if (method_exists($cacheStore, 'keys')) {
            foreach (cache()->keys('staff_books_*') as $key) {
                cache()->forget($key);
            }
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

        // Normalize image path if it's an absolute URL provided by the client
        if (isset($validated['image']) && str_starts_with($validated['image'], 'http')) {
            $parsed = parse_url($validated['image']);
            $pathParts = explode('/', ltrim($parsed['path'] ?? '', '/'));
            $storageIndex = array_search('storage', $pathParts);
            if ($storageIndex !== false) {
                $validated['image'] = implode('/', array_slice($pathParts, $storageIndex + 1));
            }
        }

        // Do not store large preview_images payloads on update either.
        if (isset($validated['preview_images'])) {
            unset($validated['preview_images']);
        }

        $book->update($validated);

        $cacheStore = cache()->getStore();
        if (method_exists($cacheStore, 'keys')) {
            foreach (cache()->keys('staff_books_*') as $key) {
                cache()->forget($key);
            }
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

        // Guard against cache stores that do not implement keys()
        $cacheStore = cache()->getStore();
        if (method_exists($cacheStore, 'keys')) {
            foreach (cache()->keys('staff_books_*') as $key) {
                cache()->forget($key);
            }
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
            'name' => 'required|string|max:255',
            'type' => 'sometimes|string|in:book,course',
        ]);

        $exists = Category::where('name', $validated['name'])
            ->where('type', $validated['type'] ?? 'book')
            ->exists();
        if ($exists) {
            return response()->json(['message' => 'Category already exists for this type'], 422);
        }

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => \Str::slug($validated['name']),
            'type' => $validated['type'] ?? 'book',
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

    public function courseCategories()
    {
        $categories = Category::where('type', 'course')
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);
        return response()->json($categories);
    }

    public function storeCourseCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $exists = Category::where('name', $validated['name'])
            ->where('type', 'course')
            ->exists();
        if ($exists) {
            return response()->json(['message' => 'Course category already exists'], 422);
        }

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => \Str::slug($validated['name']),
            'type' => 'course',
        ]);

        return response()->json([
            'category' => $category,
            'message' => 'Course category created successfully',
        ], 201);
    }

    public function deleteCourseCategory($id)
    {
        $category = Category::where('type', 'course')->findOrFail($id);
        $category->delete();

        return response()->json([
            'message' => 'Course category deleted successfully',
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

    public function allCourseQuestions(Request $request)
    {
        $perPage = $request->query('per_page', 50);
        $page = $request->query('page', 1);

        $questions = \App\Models\CourseQuestion::with(['course' => function($q) {
            $q->select('id', 'title', 'image');
        }])
            ->orderBy('created_at', 'desc')
            ->paginate((int) $perPage, ['*'], 'page', (int) $page);

        return response()->json($questions);
    }

    public function courses(Request $request)
    {
        $courses = \App\Models\Course::with(['sections.lessons.quizzes.questions', 'sections.lessons.resources', 'quizzes.questions'])->orderBy('created_at', 'desc')->get();
        return response()->json($courses);
    }

    public function storeCourse(Request $request)
    {
        \Log::info('Store Course Request:', $request->all());
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:courses,slug',
            'instructor' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration_hours' => 'required|integer|min:0',
            'lessons_count' => 'required|integer|min:0',
            'level' => 'required|string|in:beginner,intermediate,advanced',
            'image' => 'nullable|string',
            'preview_video' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'category' => 'required|string',
            'sections' => 'nullable|array',
            'sections.*.title' => 'required|string',
            'sections.*.lessons' => 'nullable|array',
            'sections.*.lessons.*.title' => 'required|string',
            'sections.*.lessons.*.description' => 'nullable|string',
            'sections.*.lessons.*.video_url' => 'nullable|string',
            'sections.*.lessons.*.duration_minutes' => 'integer|min:0',
            'sections.*.lessons.*.is_free_preview' => 'boolean',
            'sections.*.lessons.*.resources' => 'nullable|array',
            'sections.*.lessons.*.resources.*.title' => 'required|string',
            'sections.*.lessons.*.resources.*.file_path' => 'required|string',
            'sections.*.lessons.*.resources.*.file_type' => 'required|string',
            'sections.*.lessons.*.resources.*.file_size' => 'integer',
            'sections.*.lessons.*.quizzes' => 'nullable|array',
            'sections.*.lessons.*.quizzes.*.title' => 'required|string',
            'sections.*.lessons.*.quizzes.*.questions' => 'nullable|array',
            'sections.*.lessons.*.quizzes.*.questions.*.question' => 'required|string',
            'sections.*.lessons.*.quizzes.*.questions.*.options' => 'required|array|min:2',
            'sections.*.lessons.*.quizzes.*.questions.*.correct_answer' => 'required|integer|min:0',
            'quizzes' => 'nullable|array',
            'quizzes.*.title' => 'required|string',
            'quizzes.*.questions' => 'nullable|array',
            'quizzes.*.questions.*.question' => 'required|string',
            'quizzes.*.questions.*.options' => 'required|array|min:2',
            'quizzes.*.questions.*.correct_answer' => 'required|integer|min:0',
        ]);

        \DB::beginTransaction();
        try {
            $course = \App\Models\Course::create([
                'title' => $validated['title'],
                'slug' => $validated['slug'],
                'instructor' => $validated['instructor'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'duration_hours' => $validated['duration_hours'],
                'lessons_count' => $validated['lessons_count'],
                'level' => $validated['level'],
                'image' => $validated['image'] ?? null,
                'preview_video' => $validated['preview_video'] ?? null,
                'is_featured' => $validated['is_featured'] ?? false,
                'is_active' => $validated['is_active'] ?? true,
                'category' => $validated['category'],
            ]);

            if (!empty($validated['sections'])) {
                \Log::info('Creating ' . count($validated['sections']) . ' sections for course ' . $course->id);
                foreach ($validated['sections'] as $sectionIdx => $sectionData) {
                    $section = $course->sections()->create([
                        'title' => $sectionData['title'],
                        'order' => $sectionIdx,
                    ]);

                    if (!empty($sectionData['lessons'])) {
                        foreach ($sectionData['lessons'] as $lessonIdx => $lessonData) {
                            $lesson = $section->lessons()->create([
                                'title' => $lessonData['title'],
                                'description' => $lessonData['description'] ?? null,
                                'video_url' => $lessonData['video_url'] ?? null,
                                'duration_minutes' => $lessonData['duration_minutes'] ?? 0,
                                'is_free_preview' => $lessonData['is_free_preview'] ?? false,
                                'type' => 'video',
                                'order' => $lessonIdx,
                            ]);

                            if (!empty($lessonData['resources'])) {
                                foreach ($lessonData['resources'] as $resIdx => $resData) {
                                    \App\Models\CourseResource::create([
                                        'course_id' => $course->id,
                                        'lesson_id' => $lesson->id,
                                        'title' => $resData['title'],
                                        'file_path' => $resData['file_path'],
                                        'file_type' => $resData['file_type'],
                                        'file_size' => $resData['file_size'] ?? 0,
                                    ]);
                                }
                            }

                            if (!empty($lessonData['quizzes'])) {
                                foreach ($lessonData['quizzes'] as $qIdx => $quizData) {
                                    $quiz = $course->quizzes()->create([
                                        'title' => $quizData['title'],
                                        'lesson_id' => $lesson->id,
                                        'order' => $qIdx,
                                    ]);

                                    if (!empty($quizData['questions'])) {
                                        foreach ($quizData['questions'] as $qqIdx => $qqData) {
                                            $quiz->questions()->create([
                                                'question' => $qqData['question'],
                                                'options' => json_encode($qqData['options']),
                                                'correct_answer' => $qqData['correct_answer'],
                                                'order' => $qqIdx,
                                            ]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (!empty($validated['quizzes'])) {
                foreach ($validated['quizzes'] as $quizIdx => $quizData) {
                    $quiz = $course->quizzes()->create([
                        'title' => $quizData['title'],
                        'order' => $quizIdx,
                    ]);

                    if (!empty($quizData['questions'])) {
                        foreach ($quizData['questions'] as $qIdx => $qData) {
                            $quiz->questions()->create([
                                'question' => $qData['question'],
                                'options' => json_encode($qData['options']),
                                'correct_answer' => $qData['correct_answer'],
                                'order' => $qIdx,
                            ]);
                        }
                    }
                }
            }

            \DB::commit();
            return response()->json($course->load(['sections.lessons', 'quizzes.questions']), 201);
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json(['message' => 'Failed to create course: ' . $e->getMessage()], 400);
        }
    }

    public function updateCourse(Request $request, $id)
    {
        $course = \App\Models\Course::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:courses,slug,' . $id,
            'instructor' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'duration_hours' => 'sometimes|integer|min:0',
            'lessons_count' => 'sometimes|integer|min:0',
            'level' => 'sometimes|string|in:beginner,intermediate,advanced',
            'image' => 'nullable|string',
            'preview_video' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'category' => 'sometimes|string',
            'sections' => 'sometimes|array',
            'sections.*.id' => 'nullable|integer',
            'sections.*.title' => 'required_with:sections|string|max:255',
            'sections.*.order' => 'integer',
            'sections.*.lessons' => 'sometimes|array',
            'sections.*.lessons.*.id' => 'nullable|integer',
            'sections.*.lessons.*.title' => 'required|string|max:255',
            'sections.*.lessons.*.description' => 'nullable|string',
            'sections.*.lessons.*.video_url' => 'nullable|string',
            'sections.*.lessons.*.duration_minutes' => 'integer|min:0',
            'sections.*.lessons.*.is_free_preview' => 'boolean',
            'sections.*.lessons.*.order' => 'integer',
            'sections.*.lessons.*.resources' => 'sometimes|array',
            'sections.*.lessons.*.resources.*.id' => 'nullable|integer',
            'sections.*.lessons.*.resources.*.title' => 'required|string',
            'sections.*.lessons.*.resources.*.file_path' => 'required|string',
            'sections.*.lessons.*.resources.*.file_type' => 'string',
            'sections.*.lessons.*.resources.*.file_size' => 'integer',
            'sections.*.lessons.*.quizzes' => 'sometimes|array',
            'sections.*.lessons.*.quizzes.*.id' => 'nullable|integer',
            'sections.*.lessons.*.quizzes.*.title' => 'required|string',
            'sections.*.lessons.*.quizzes.*.order' => 'integer',
            'sections.*.lessons.*.quizzes.*.questions' => 'sometimes|array',
            'sections.*.lessons.*.quizzes.*.questions.*.id' => 'nullable|integer',
            'sections.*.lessons.*.quizzes.*.questions.*.question' => 'required|string',
            'sections.*.lessons.*.quizzes.*.questions.*.options' => 'required|array',
            'sections.*.lessons.*.quizzes.*.questions.*.correct_answer' => 'required|integer',
            'sections.*.lessons.*.quizzes.*.questions.*.order' => 'integer',
            'quizzes' => 'sometimes|array',
            'quizzes.*.id' => 'nullable|integer',
            'quizzes.*.title' => 'required|string',
            'quizzes.*.order' => 'integer',
            'quizzes.*.questions' => 'sometimes|array',
            'quizzes.*.questions.*.id' => 'nullable|integer',
            'quizzes.*.questions.*.question' => 'required|string',
            'quizzes.*.questions.*.options' => 'required|array',
            'quizzes.*.questions.*.correct_answer' => 'required|integer',
            'quizzes.*.questions.*.order' => 'integer',
        ]);

        \DB::beginTransaction();
        try {
            // Update basic course fields
            $basicFields = ['title', 'slug', 'instructor', 'description', 'price', 'duration_hours', 'lessons_count', 'level', 'image', 'preview_video', 'is_featured', 'is_active', 'category'];
            foreach ($basicFields as $field) {
                if (isset($validated[$field])) {
                    $course->$field = $validated[$field];
                }
            }
            $course->save();

            // Update sections
            if (isset($validated['sections'])) {
                $sectionIds = [];
                foreach ($validated['sections'] as $sIdx => $sectionData) {
                    $section = null;
                    if (!empty($sectionData['id'])) {
                        $section = \App\Models\CourseSection::find($sectionData['id']);
                    }
                    if (!$section) {
                        $section = new \App\Models\CourseSection();
                        $section->course_id = $course->id;
                    }
                    $section->title = $sectionData['title'];
                    $section->order = $sectionData['order'] ?? $sIdx;
                    $section->save();
                    $sectionIds[] = $section->id;

                    // Update lessons
                    if (isset($sectionData['lessons'])) {
                        $lessonIds = [];
                        foreach ($sectionData['lessons'] as $lIdx => $lessonData) {
                            $lesson = null;
                            if (!empty($lessonData['id'])) {
                                $lesson = \App\Models\CourseLesson::find($lessonData['id']);
                            }
                            if (!$lesson) {
                                $lesson = new \App\Models\CourseLesson();
                                $lesson->section_id = $section->id;
                            }
                            $lesson->title = $lessonData['title'];
                            $lesson->description = $lessonData['description'] ?? null;
                            $lesson->video_url = $lessonData['video_url'] ?? null;
                            $lesson->duration_minutes = $lessonData['duration_minutes'] ?? 0;
                            $lesson->is_free_preview = $lessonData['is_free_preview'] ?? false;
                            $lesson->order = $lessonData['order'] ?? $lIdx;
                            $lesson->save();
                            $lessonIds[] = $lesson->id;

                            // Update lesson resources
                            if (isset($lessonData['resources'])) {
                                $resourceIds = [];
                                foreach ($lessonData['resources'] as $rIdx => $resData) {
                                    $resource = null;
                                    if (!empty($resData['id'])) {
                                        $resource = \App\Models\CourseResource::find($resData['id']);
                                    }
                                    if (!$resource) {
                                        $resource = new \App\Models\CourseResource();
                                        $resource->lesson_id = $lesson->id;
                                        $resource->course_id = $course->id;
                                    }
                                    $resource->title = $resData['title'];
                                    $resource->file_path = $resData['file_path'];
                                    $resource->file_type = $resData['file_type'] ?? 'document';
                                    $resource->file_size = $resData['file_size'] ?? 0;
                                    $resource->save();
                                    $resourceIds[] = $resource->id;
                                }
                                // Delete removed resources
                                \App\Models\CourseResource::where('lesson_id', $lesson->id)
                                    ->whereNotIn('id', $resourceIds)->delete();
                            }

                            // Update lesson quizzes
                            if (isset($lessonData['quizzes'])) {
                                $lQuizIds = [];
                                foreach ($lessonData['quizzes'] as $qIdx => $quizData) {
                                    $quiz = null;
                                    if (!empty($quizData['id'])) {
                                        $quiz = \App\Models\CourseQuiz::find($quizData['id']);
                                    }
                                    if (!$quiz) {
                                        $quiz = new \App\Models\CourseQuiz();
                                        $quiz->lesson_id = $lesson->id;
                                    }
                                    $quiz->title = $quizData['title'];
                                    $quiz->order = $quizData['order'] ?? $qIdx;
                                    $quiz->save();
                                    $lQuizIds[] = $quiz->id;

                                    // Update quiz questions
                                    if (isset($quizData['questions'])) {
                                        $questionIds = [];
                                        foreach ($quizData['questions'] as $qqIdx => $qData) {
                                            $question = null;
                                            if (!empty($qData['id'])) {
                                                $question = \App\Models\CourseQuizQuestion::find($qData['id']);
                                            }
                                            if (!$question) {
                                                $question = new \App\Models\CourseQuizQuestion();
                                                $question->quiz_id = $quiz->id;
                                            }
                                            $question->question = $qData['question'];
                                            $question->options = $qData['options'];
                                            $question->correct_answer = $qData['correct_answer'];
                                            $question->order = $qData['order'] ?? $qqIdx;
                                            $question->save();
                                            $questionIds[] = $question->id;
                                        }
                                        \App\Models\CourseQuizQuestion::where('quiz_id', $quiz->id)
                                            ->whereNotIn('id', $questionIds)->delete();
                                    }
                                }
                                \App\Models\CourseQuiz::where('lesson_id', $lesson->id)
                                    ->whereNotIn('id', $lQuizIds)->delete();
                            }
                        }
                        \App\Models\CourseLesson::where('section_id', $section->id)
                            ->whereNotIn('id', $lessonIds)->delete();
                    }
                }
                // Delete removed sections
                \App\Models\CourseSection::where('course_id', $course->id)
                    ->whereNotIn('id', $sectionIds)->delete();
            }

            // Update course-level quizzes
            if (isset($validated['quizzes'])) {
                $quizIds = [];
                foreach ($validated['quizzes'] as $qIdx => $quizData) {
                    $quiz = null;
                    if (!empty($quizData['id'])) {
                        $quiz = \App\Models\CourseQuiz::find($quizData['id']);
                    }
                    if (!$quiz) {
                        $quiz = new \App\Models\CourseQuiz();
                        $quiz->course_id = $course->id;
                    }
                    $quiz->title = $quizData['title'];
                    $quiz->order = $quizData['order'] ?? $qIdx;
                    $quiz->save();
                    $quizIds[] = $quiz->id;

                    // Update quiz questions
                    if (isset($quizData['questions'])) {
                        $questionIds = [];
                        foreach ($quizData['questions'] as $qqIdx => $qData) {
                            $question = null;
                            if (!empty($qData['id'])) {
                                $question = \App\Models\CourseQuizQuestion::find($qData['id']);
                            }
                            if (!$question) {
                                $question = new \App\Models\CourseQuizQuestion();
                                $question->quiz_id = $quiz->id;
                            }
                            $question->question = $qData['question'];
                            $question->options = $qData['options'];
                            $question->correct_answer = $qData['correct_answer'];
                            $question->order = $qData['order'] ?? $qqIdx;
                            $question->save();
                            $questionIds[] = $question->id;
                        }
                        \App\Models\CourseQuizQuestion::where('quiz_id', $quiz->id)
                            ->whereNotIn('id', $questionIds)->delete();
                    }
                }
                // Delete removed course-level quizzes
                \App\Models\CourseQuiz::where('course_id', $course->id)
                    ->whereNull('lesson_id')
                    ->whereNotIn('id', $quizIds)->delete();
            }

            // Recalculate lessons_count and duration_hours
            $sectionIds = \App\Models\CourseSection::where('course_id', $course->id)->pluck('id');
            $totalLessons = \App\Models\CourseLesson::whereIn('section_id', $sectionIds)->count();
            $totalMinutes = \App\Models\CourseLesson::whereIn('section_id', $sectionIds)->sum('duration_minutes');
            $course->lessons_count = $totalLessons;
            $course->duration_hours = $totalMinutes > 0 ? (int) ceil($totalMinutes / 60) : 0;
            $course->save();

            \DB::commit();
            return response()->json($course->load(['sections.lessons', 'quizzes.questions']));
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json(['message' => 'Failed to update course', 'error' => $e->getMessage()], 500);
        }
    }

    public function deleteCourse($id)
    {
        $course = \App\Models\Course::findOrFail($id);
        $course->delete();
        return response()->json(['message' => 'Course deleted successfully']);
    }

    public function uploadCourseFile(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:512000',
            'type' => 'required|in:video,document,image',
        ]);
        
        $file = $request->file('file');
        $type = $request->input('type');
        $directory = match($type) {
            'video' => 'courses/videos',
            'document' => 'courses/documents',
            'image' => 'courses/thumbnails',
            default => 'courses/misc',
        };

        // Generate a short unique filename (20 chars + extension) to keep URLs small
        $extension = $file->getClientOriginalExtension();
        $shortName = \Illuminate\Support\Str::random(20) . '.' . $extension;
        $path = $file->storeAs($directory, $shortName, 'public');
        
        return response()->json([
            'url' => asset('storage/' . $path),
            'path' => $path,
            'size' => $file->getSize(),
            'name' => $shortName,
        ]);
    }
}
