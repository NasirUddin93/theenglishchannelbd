<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Enrollment count per course:\n";
echo str_repeat('-', 60) . "\n";

$courses = \App\Models\Course::select('id', 'title')->get();
foreach ($courses as $course) {
    $count = \App\Models\OrderItem::where('course_id', $course->id)
        ->join('orders', 'order_items.order_id', '=', 'orders.id')
        ->where('orders.status', 'delivered')
        ->count();
    echo "Course {$course->id} (" . substr($course->title, 0, 30) . "): {$count} enrolled\n";
}

echo "\nTotal courses: " . $courses->count() . "\n";
echo "Total enrollments: " . \App\Models\OrderItem::whereNotNull('course_id')
    ->join('orders', 'order_items.order_id', '=', 'orders.id')
    ->where('orders.status', 'delivered')
    ->count() . "\n";
