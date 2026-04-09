<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Simulating API Response for N@gmail.com Orders ===\n\n";

$user = \App\Models\User::where('email', 'N@gmail.com')->first();
if (!$user) {
    echo "User not found!\n";
    exit(1);
}

// Same query as OrderController@index
$orders = $user->orders()
    ->select('id', 'user_id', 'total', 'status', 'payment_method', 'shipping_address', 'city', 'state', 'postal_code', 'phone', 'notes', 'created_at', 'updated_at')
    ->with(['items' => function($query) {
        $query->select('id', 'order_id', 'book_id', 'course_id', 'quantity', 'price');
    }, 'items.book' => function($query) {
        $query->select('id', 'title', 'author', 'price', 'image');
    }, 'items.course' => function($query) {
        $query->select('id', 'title', 'instructor', 'price', 'image');
    }])
    ->orderBy('created_at', 'desc')
    ->get();

echo "Orders count: " . $orders->count() . "\n\n";

// Simulate what frontend receives
$jsonResponse = $orders->map(function($order) {
    return [
        'id' => $order->id,
        'user_id' => $order->user_id,
        'total' => $order->total,
        'status' => $order->status,
        'payment_method' => $order->payment_method,
        'created_at' => $order->created_at,
        'items' => $order->items->map(function($item) {
            return [
                'id' => $item->id,
                'order_id' => $item->order_id,
                'book_id' => $item->book_id,
                'course_id' => $item->course_id,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'book' => $item->book ? [
                    'id' => $item->book->id,
                    'title' => $item->book->title,
                    'author' => $item->book->author,
                    'price' => $item->book->price,
                    'image' => $item->book->image,
                ] : null,
                'course' => $item->course ? [
                    'id' => $item->course->id,
                    'title' => $item->course->title,
                    'instructor' => $item->course->instructor,
                    'price' => $item->course->price,
                    'image' => $item->course->image,
                ] : null,
            ];
        }),
    ];
});

echo "JSON Response (what frontend receives):\n";
echo json_encode($jsonResponse, JSON_PRETTY_PRINT) . "\n\n";

// Now simulate what frontend extracts as enrolled courses
echo "\n=== Frontend Extraction Simulation ===\n";
$enrolledCourses = [];
$seenCourseIds = [];

foreach ($jsonResponse as $order) {
    if ($order['status'] === 'cancelled') continue;
    
    foreach ($order['items'] as $item) {
        $courseId = $item['course_id'] ?? $item['courseId'] ?? null;
        $isCourse = $item['course'] !== null || $item['course_id'] !== null;
        
        if ($isCourse && $courseId && !isset($seenCourseIds[$courseId])) {
            $seenCourseIds[$courseId] = true;
            $courseData = $item['course'] ?? $item;
            
            $enrolledCourses[] = [
                'id' => (string)$courseId,
                'title' => $courseData['title'] ?? $item['title'] ?? 'Unknown Course',
                'slug' => $courseData['slug'] ?? $item['slug'] ?? '',
                'instructor' => $courseData['instructor'] ?? $item['author'] ?? 'Unknown',
                'price' => $item['price'] ?? $courseData['price'] ?? 0,
                'coverUrl' => $courseData['image'] ?? null,
                'orderDate' => $order['created_at'],
                'orderId' => $order['id'],
                'status' => $order['status'],
            ];
            
            echo "✅ Extracted: {$courseData['title']} (ID: {$courseId})\n";
            echo "   - courseId: {$courseId}\n";
            echo "   - has course object: " . ($item['course'] ? 'YES' : 'NO') . "\n";
            echo "   - image: " . ($courseData['image'] ?? 'NULL') . "\n";
        }
    }
}

if (empty($enrolledCourses)) {
    echo "❌ NO COURSES EXTRACTED by frontend logic!\n";
} else {
    echo "\n📊 Total Extracted Courses: " . count($enrolledCourses) . "\n";
    echo "\nExtracted data:\n";
    print_r($enrolledCourses);
}
