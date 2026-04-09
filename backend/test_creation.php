<?php
use App\Models\Course;
use App\Models\CourseSection;

$course = Course::create([
    'title' => 'Tinker Test',
    'slug' => 'tinker-test-' . time(),
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
    'title' => 'S1',
    'order' => 0,
]);

echo "Course ID: " . $course->id . "\n";
echo "Section ID: " . $section->id . "\n";
