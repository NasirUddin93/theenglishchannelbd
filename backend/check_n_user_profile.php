<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Checking N@gmail.com Orders for Profile Display ===\n\n";

$user = \App\Models\User::where('email', 'N@gmail.com')->first();
if (!$user) {
    echo "User N@gmail.com not found!\n";
    exit(1);
}

echo "User ID: {$user->id}\n";
echo "User Email: {$user->email}\n\n";

// Get all orders for this user (same query as OrderController@index)
$orders = $user->orders()
    ->with(['items' => function($query) {
        $query->select('id', 'order_id', 'book_id', 'course_id', 'quantity', 'price');
    }, 'items.book' => function($query) {
        $query->select('id', 'title', 'author', 'price', 'image');
    }, 'items.course' => function($query) {
        $query->select('id', 'title', 'instructor', 'price', 'image');
    }])
    ->orderBy('created_at', 'desc')
    ->get();

echo "Total Orders: {$orders->count()}\n\n";

foreach ($orders as $order) {
    echo "Order ID: {$order->id}\n";
    echo "  Status: {$order->status}\n";
    echo "  Total: ৳{$order->total}\n";
    echo "  Items:\n";
    
    foreach ($order->items as $item) {
        if ($item->course_id) {
            echo "    📚 COURSE: {$item->course->title} (ID: {$item->course_id}) - ৳{$item->price}\n";
        } elseif ($item->book_id) {
            echo "    📖 BOOK: {$item->book->title} (ID: {$item->book_id}) - ৳{$item->price}\n";
        }
    }
    echo "\n";
}

// Simulate what Profile page extracts as enrolled courses
echo "\n=== Simulating Profile → My Courses Extraction ===\n";
$enrolledCourses = [];
$seenCourseIds = [];

foreach ($orders as $order) {
    if ($order->status === 'cancelled') continue;
    
    foreach ($order->items as $item) {
        $courseId = $item->course_id;
        $isCourse = $item->course || $item->course_id !== null;
        
        if ($isCourse && $courseId && !isset($seenCourseIds[$courseId])) {
            $seenCourseIds[$courseId] = true;
            $course = \App\Models\Course::find($courseId);
            
            $enrolledCourses[] = [
                'id' => $courseId,
                'title' => $course ? $course->title : 'Unknown',
                'slug' => $course ? $course->slug : '',
                'instructor' => $course ? $course->instructor : 'Unknown',
                'price' => $item->price,
                'coverUrl' => $course && $course->image ? $course->image : null,
                'orderDate' => $order->created_at,
                'orderId' => $order->id,
                'status' => $order->status,
            ];
            
            echo "✅ Course Found: {$course->title} (ID: {$courseId}) from Order {$order->id}\n";
        }
    }
}

if (empty($enrolledCourses)) {
    echo "❌ NO COURSES FOUND in orders!\n";
} else {
    echo "\n📊 Total Enrolled Courses: " . count($enrolledCourses) . "\n";
}
