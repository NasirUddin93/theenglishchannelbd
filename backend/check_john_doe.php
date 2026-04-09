<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Searching for John Doe user...\n";
echo str_repeat('=', 80) . "\n";

$user = \App\Models\User::where('email', 'like', '%john%')
    ->orWhere('name', 'like', '%john%')
    ->first();

if (!$user) {
    echo "John Doe not found. Listing all users:\n";
    \App\Models\User::all()->each(function($u) {
        echo "ID: {$u->id}, Name: {$u->name}, Email: {$u->email}\n";
    });
    $userId = readline("\nEnter user ID to check: ");
    $user = \App\Models\User::find($userId);
}

if ($user) {
    echo "\nUser Found:\n";
    echo "ID: {$user->id}\n";
    echo "Name: {$user->name}\n";
    echo "Email: {$user->email}\n\n";

    $orders = \App\Models\Order::with('items')->where('user_id', $user->id)->get();
    echo "Orders count: " . $orders->count() . "\n\n";

    foreach ($orders as $order) {
        echo "Order ID: {$order->id} | Status: {$order->status} | Total: ৳{$order->total}\n";
        foreach ($order->items as $item) {
            $type = $item->course_id ? 'COURSE' : 'BOOK';
            $id = $item->course_id ?: $item->book_id;
            echo "  → {$type} (ID: {$id}) - Price: ৳{$item->price}\n";
        }
        echo "\n";
    }

    echo "\nEnrollment count per course from ALL orders:\n";
    echo str_repeat('-', 80) . "\n";
    $courses = \App\Models\Course::select('id', 'title')->get();
    foreach ($courses as $course) {
        $count = \App\Models\OrderItem::where('course_id', $course->id)
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'delivered')
            ->count();
        echo "Course {$course->id} (" . substr($course->title, 0, 30) . "): {$count} enrolled\n";
    }
}
