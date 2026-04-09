<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "============================================================\n";
echo "           COURSE PURCHASE DATABASE ANALYSIS\n";
echo "============================================================\n\n";

// 1. USERS TABLE
echo "1️⃣  USERS TABLE\n";
echo str_repeat('-', 70) . "\n";
printf("%-5s | %-20s | %-25s | %-10s\n", "ID", "Name", "Email", "Role");
echo str_repeat('-', 70) . "\n";
\App\Models\User::all()->each(function($u) {
    printf("%-5s | %-20s | %-25s | %-10s\n", $u->id, substr($u->name, 0, 20), substr($u->email, 0, 25), $u->role);
});

// 2. ORDERS TABLE
echo "\n\n2️⃣  ORDERS TABLE\n";
echo str_repeat('-', 110) . "\n";
printf("%-5s | %-5s | %-25s | %-12s | %-15s | %-30s | %-20s\n", 
    "ID", "UID", "Payment Method", "Status", "Total", "Shipping Address", "Created At");
echo str_repeat('-', 110) . "\n";
\App\Models\Order::orderBy('created_at', 'desc')->limit(20)->get()->each(function($o) {
    printf("%-5s | %-5s | %-25s | %-12s | %-15s | %-30s | %-20s\n", 
        $o->id, 
        $o->user_id, 
        $o->payment_method, 
        $o->status, 
        $o->total,
        substr($o->shipping_address ?? 'NULL', 0, 30),
        $o->created_at
    );
});

// 3. ORDER ITEMS TABLE (with course/book info)
echo "\n\n3️⃣  ORDER ITEMS TABLE (Course Enrollments)\n";
echo str_repeat('-', 130) . "\n";
printf("%-5s | %-8s | %-10s | %-10s | %-8s | %-35s | %-15s\n", 
    "ID", "Order ID", "Book ID", "Course ID", "Price", "Course/Book Title", "Order Status");
echo str_repeat('-', 130) . "\n";

$items = \App\Models\OrderItem::orderBy('id', 'desc')->get();
foreach ($items as $item) {
    $order = \App\Models\Order::find($item->order_id);
    $title = 'N/A';
    if ($item->course_id) {
        $course = \App\Models\Course::find($item->course_id);
        $title = $course ? substr($course->title, 0, 35) : 'COURSE DELETED';
    } elseif ($item->book_id) {
        $book = \App\Models\Book::find($item->book_id);
        $title = $book ? substr($book->title, 0, 35) : 'BOOK DELETED';
    }
    
    printf("%-5s | %-8s | %-10s | %-10s | %-8s | %-35s | %-15s\n", 
        $item->id,
        $item->order_id,
        $item->book_id ?? 'NULL',
        $item->course_id ?? 'NULL',
        $item->price,
        $title,
        $order ? $order->status : 'ORDER DELETED'
    );
}

// 4. COURSE ENROLLMENTS PER USER
echo "\n\n4️⃣  COURSE ENROLLMENTS PER USER (Completed Orders Only)\n";
echo str_repeat('-', 100) . "\n";
printf("%-25s | %-35s | %-12s | %-20s\n", "User Email", "Course Title", "Order Status", "Enrolled At");
echo str_repeat('-', 100) . "\n";

$enrollments = \DB::table('order_items')
    ->join('orders', 'order_items.order_id', '=', 'orders.id')
    ->join('users', 'orders.user_id', '=', 'users.id')
    ->join('courses', 'order_items.course_id', '=', 'courses.id')
    ->whereNotNull('order_items.course_id')
    ->whereIn('orders.status', ['delivered', 'completed'])
    ->select('users.email', 'courses.title', 'orders.status', 'orders.created_at')
    ->orderBy('orders.created_at', 'desc')
    ->get();

if ($enrollments->isEmpty()) {
    echo "No course enrollments found in database!\n";
} else {
    foreach ($enrollments as $env) {
        printf("%-25s | %-35s | %-12s | %-20s\n", 
            substr($env->email, 0, 25),
            substr($env->title, 0, 35),
            $env->status,
            $env->created_at
        );
    }
}

// 5. SUMMARY
echo "\n\n5️⃣  SUMMARY\n";
echo str_repeat('-', 70) . "\n";
$totalUsers = \App\Models\User::count();
$totalOrders = \App\Models\Order::count();
$totalCourseItems = \App\Models\OrderItem::whereNotNull('course_id')->count();
$totalBookItems = \App\Models\OrderItem::whereNotNull('book_id')->count();
$completedCourseOrders = \App\Models\Order::whereHas('items', function($q) {
    $q->whereNotNull('course_id');
})->whereIn('status', ['delivered', 'completed'])->count();

echo "Total Users: {$totalUsers}\n";
echo "Total Orders: {$totalOrders}\n";
echo "Total Course Order Items: {$totalCourseItems}\n";
echo "Total Book Order Items: {$totalBookItems}\n";
echo "Completed Course Orders: {$completedCourseOrders}\n";

echo "\n\n============================================================\n";
echo "                  END OF ANALYSIS\n";
echo "============================================================\n";
