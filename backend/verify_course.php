<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Course;
use App\Models\CourseSection;
use App\Models\CourseLesson;

// Clean up old test courses
Course::where('title', 'Verification Course')->delete();

$course = Course::create([
    'title' => 'Verification Course',
    'slug' => 'verification-course-' . time(),
    'instructor' => 'Verification Instructor',
    'description' => 'Verification Description',
    'price' => 10,
    'duration_hours' => 1,
    'lessons_count' => 2,
    'level' => 'beginner',
    'category' => 'language',
    'is_active' => true,
]);

$section = $course->sections()->create([
    'title' => 'Section 1',
    'order' => 0,
]);

$section->lessons()->create([
    'title' => 'Lesson 1',
    'duration_minutes' => 30,
    'order' => 0,
]);

$section->lessons()->create([
    'title' => 'Lesson 2',
    'duration_minutes' => 30,
    'order' => 1,
]);

echo "Course Created: " . $course->slug . "\n";
echo "Sections: " . $course->sections()->count() . "\n";
echo "Lessons: " . $course->sections()->first()->lessons()->count() . "\n";
