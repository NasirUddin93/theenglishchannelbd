<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Adding TEST course enrollment...\n";
echo str_repeat('-', 60) . "\n";

// Find a user
$user = \App\Models\User::first();
if (!$user) {
    echo "No users found!\n";
    exit(1);
}

echo "User: {$user->name} (ID: {$user->id})\n";

// Find TEST course
$course = \App\Models\Course::where('slug', 'test')->orWhere('title', 'like', '%TEST%')->first();
if (!$course) {
    echo "TEST course not found!\n";
    exit(1);
}

echo "Course: {$course->title} (ID: {$course->id})\n";

// Check if already enrolled
$exists = \App\Models\OrderItem::where('course_id', $course->id)
    ->join('orders', 'order_items.order_id', '=', 'orders.id')
    ->where('orders.user_id', $user->id)
    ->exists();

if ($exists) {
    echo "Already enrolled!\n";
    exit(0);
}

// Create order
$order = \App\Models\Order::create([
    'user_id' => $user->id,
    'total' => $course->price,
    'status' => 'completed',
    'payment_method' => 'cod',
    'shipping_address' => 'N/A - Course Only',
    'city' => 'N/A',
    'state' => null,
    'postal_code' => null,
    'phone' => $user->phone ?? '0000000000',
    'notes' => 'Course enrollment order',
]);

// Create order item
\App\Models\OrderItem::create([
    'order_id' => $order->id,
    'course_id' => $course->id,
    'quantity' => 1,
    'price' => $course->price,
]);

echo "\n✅ Successfully enrolled!\n";
echo "Order ID: {$order->id}\n";
echo "Course: {$course->title}\n";
echo "Status: completed\n";

// Verify count
$count = \App\Models\OrderItem::where('course_id', $course->id)
    ->join('orders', 'order_items.order_id', '=', 'orders.id')
    ->whereIn('orders.status', ['delivered', 'completed'])
    ->count();

echo "\nUpdated enrollment count for {$course->title}: {$count}\n";
