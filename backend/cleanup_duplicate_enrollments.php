<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== CLEANING DUPLICATE ENROLLMENTS ===\n\n";

// Find N@gmail.com user
$user = \App\Models\User::where('email', 'N@gmail.com')->first();
if (!$user) {
    echo "User N@gmail.com not found!\n";
    exit(1);
}

echo "User: {$user->name} (ID: {$user->id})\n\n";

// Find all completed course enrollments for this user
$enrollments = \App\Models\OrderItem::whereNotNull('course_id')
    ->join('orders', 'order_items.order_id', '=', 'orders.id')
    ->where('orders.user_id', $user->id)
    ->whereIn('orders.status', ['delivered', 'completed'])
    ->select('order_items.*', 'orders.id as order_id', 'orders.status as order_status')
    ->get();

echo "Found {$enrollments->count()} course enrollments:\n";
echo str_repeat('-', 80) . "\n";

// Group by course_id
$grouped = $enrollments->groupBy('course_id');
$deletedOrders = 0;
$deletedItems = 0;

foreach ($grouped as $courseId => $items) {
    $course = \App\Models\Course::find($courseId);
    $courseName = $course ? $course->title : "Course ID: $courseId";
    echo "\nCourse: {$courseName} (ID: {$courseId})\n";
    echo "  Enrollments: {$items->count()}\n";
    
    if ($items->count() > 1) {
        echo "  ⚠️  DUPLICATE DETECTED - Keeping only the latest enrollment\n";
        
        // Keep the latest order, delete the rest
        $sorted = $items->sortByDesc('order_id');
        $keep = $sorted->first();
        $toDelete = $sorted->slice(1);
        
        echo "  ✓ Keeping Order ID: {$keep->order_id}\n";
        
        foreach ($toDelete as $delete) {
            echo "  ✗ Deleting Order ID: {$delete->order_id}\n";
            
            // Delete the order (cascade should delete order_items)
            \App\Models\Order::where('id', $delete->order_id)->delete();
            $deletedOrders++;
            $deletedItems++;
        }
    } else {
        echo "  ✅ No duplicates\n";
    }
}

echo "\n\n=== CLEANUP SUMMARY ===\n";
echo "Deleted Orders: {$deletedOrders}\n";
echo "Deleted Order Items: {$deletedItems}\n";

// Verify cleanup
echo "\n=== VERIFICATION ===\n";
$remaining = \App\Models\OrderItem::whereNotNull('course_id')
    ->join('orders', 'order_items.order_id', '=', 'orders.id')
    ->where('orders.user_id', $user->id)
    ->whereIn('orders.status', ['delivered', 'completed'])
    ->select('order_items.course_id', 'orders.id as order_id', 'courses.title')
    ->join('courses', 'order_items.course_id', '=', 'courses.id')
    ->get();

echo "Remaining enrollments for N@gmail.com:\n";
foreach ($remaining as $r) {
    echo "  - Course: {$r->title} (Order ID: {$r->order_id})\n";
}
