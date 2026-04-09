<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Adding test course enrollments for John Doe...\n";
echo str_repeat('=', 80) . "\n";

$user = \App\Models\User::where('email', 'john@example.com')->first();

if (!$user) {
    echo "John Doe not found!\n";
    exit(1);
}

echo "User: {$user->name} (ID: {$user->id})\n\n";

// Get some courses
$courses = \App\Models\Course::whereIn('id', [1, 2, 4])->get();

echo "Creating enrollments for:\n";
foreach ($courses as $course) {
    echo "- {$course->title}\n";
}
echo "\n";

try {
    DB::beginTransaction();

    // Create a completed order with courses
    $order = \App\Models\Order::create([
        'user_id' => $user->id,
        'total' => 0,
        'status' => 'completed',
        'payment_method' => 'cod',
        'shipping_address' => 'N/A - Course Only',
        'city' => 'N/A',
        'state' => null,
        'postal_code' => null,
        'phone' => $user->phone ?? '0000000000',
        'notes' => 'Course enrollment order',
    ]);

    $total = 0;
    foreach ($courses as $course) {
        \App\Models\OrderItem::create([
            'order_id' => $order->id,
            'course_id' => $course->id,
            'quantity' => 1,
            'price' => $course->price,
        ]);
        $total += floatval($course->price);
        echo "✓ Enrolled in: {$course->title} (৳{$course->price})\n";
    }

    $order->update(['total' => $total]);

    DB::commit();

    echo "\n✅ Success! Order created with ID: {$order->id}\n";
    echo "Total: ৳{$total}\n\n";

    // Verify enrollment counts
    echo "Updated enrollment counts:\n";
    echo str_repeat('-', 60) . "\n";
    foreach ($courses as $course) {
        $count = \App\Models\OrderItem::where('course_id', $course->id)
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed')
            ->orWhere('orders.status', 'delivered')
            ->count();
        echo "Course {$course->id} ({$course->title}): {$count} enrolled\n";
    }

} catch (\Exception $e) {
    DB::rollBack();
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
