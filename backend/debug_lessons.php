<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Course;

$course = Course::with('sections.lessons')->first();

if (!$course) {
    echo "No course found\n";
    exit;
}

echo "Course: " . $course->title . " (ID: " . $course->id . ")\n";
echo "Sections count: " . $course->sections->count() . "\n";

foreach ($course->sections as $section) {
    echo "Section: " . $section->title . " (ID: " . $section->id . ")\n";
    echo "Lessons count: " . $section->lessons->count() . "\n";
    foreach ($section->lessons as $lesson) {
        echo " - Lesson: " . $lesson->title . " (ID: " . $lesson->id . ")\n";
    }
}
