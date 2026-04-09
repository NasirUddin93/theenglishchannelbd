<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Course;
use App\Models\CourseSection;
use App\Models\CourseLesson;

$course = Course::create([
    'title' => 'Tinker Course',
    'slug' => 'tinker-course-' . time(),
    'instructor' => 'Test',
    'description' => 'Test',
    'price' => 10,
    'duration_hours' => 1,
    'lessons_count' => 1,
    'level' => 'beginner',
    'category' => 'language',
    'is_active' => true,
]);

$section = $course->sections()->create([
    'title' => 'Section 1',
    'order' => 0,
]);

$lesson = $section->lessons()->create([
    'title' => 'Lesson 1',
    'order' => 0,
]);

echo "Course ID: " . $course->id . "\n";
echo "Section ID: " . $section->id . "\n";
echo "Lesson ID: " . $lesson->id . "\n";
