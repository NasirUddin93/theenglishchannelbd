<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Checking TEST Course Data ===\n\n";

$course = \App\Models\Course::find(26);
if (!$course) {
    echo "Course ID 26 not found!\n";
    exit(1);
}

echo "Course Details:\n";
echo str_repeat('-', 50) . "\n";
echo "ID: {$course->id}\n";
echo "Title: {$course->title}\n";
echo "Slug: '{$course->slug}'\n";
echo "Instructor: {$course->instructor}\n";
echo "Price: {$course->price}\n";
echo "Is Active: " . ($course->is_active ? 'Yes' : 'No') . "\n";

echo "\nAll courses with their slugs:\n";
echo str_repeat('-', 80) . "\n";
printf("%-5s | %-30s | %-30s | %-10s\n", "ID", "Title", "Slug", "Active");
echo str_repeat('-', 80) . "\n";
\App\Models\Course::select('id', 'title', 'slug', 'is_active')->get()->each(function($c) {
    printf("%-5s | %-30s | %-30s | %-10s\n", 
        $c->id, 
        substr($c->title, 0, 30), 
        $c->slug ?: '(EMPTY)', 
        $c->is_active ? 'Yes' : 'No'
    );
});
