<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "All course enrollments in database:\n";
echo str_repeat('-', 60) . "\n";

$items = \App\Models\OrderItem::whereNotNull('course_id')->with('order')->get();
foreach($items as $item) {
    $status = $item->order ? $item->order->status : 'NO ORDER';
    echo "Course ID: {$item->course_id} | Order Status: {$status}\n";
}

echo "\nCourse 26 (TEST) enrollments:\n";
echo str_repeat('-', 60) . "\n";
$count = \App\Models\OrderItem::where('course_id', 26)
    ->join('orders', 'order_items.order_id', '=', 'orders.id')
    ->whereIn('orders.status', ['delivered', 'completed'])
    ->count();
echo "Enrolled (delivered/completed): {$count}\n";

$countAll = \App\Models\OrderItem::where('course_id', 26)
    ->join('orders', 'order_items.order_id', '=', 'orders.id')
    ->count();
echo "Total (any status): {$countAll}\n";
