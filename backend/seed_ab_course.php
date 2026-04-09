<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Course;
use App\Models\CourseSection;
use App\Models\CourseLesson;
use App\Models\CourseQuiz;
use App\Models\CourseQuizQuestion;
use App\Models\CourseResource;

// Delete existing AB course
Course::where('slug', 'ab-course')->delete();

$course = Course::create([
    'title' => 'AB',
    'slug' => 'ab-course',
    'instructor' => 'AB Instructor',
    'description' => 'This is a comprehensive test course named AB with full curriculum, quizzes, and resources.',
    'price' => 100,
    'duration_hours' => 5,
    'lessons_count' => 6,
    'level' => 'beginner',
    'image' => 'https://placehold.co/600x400/orange/white?text=AB+Course',
    'preview_video' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'is_featured' => true,
    'is_active' => true,
    'category' => 'language',
]);

// Section 1: Introduction
$s1 = $course->sections()->create(['title' => 'Module 1: Introduction', 'order' => 0]);

$l1 = $s1->lessons()->create(['title' => 'Welcome to the Course', 'type' => 'video', 'description' => 'Overview of what you will learn', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration_minutes' => 15, 'is_free_preview' => true, 'order' => 0]);
$l2 = $s1->lessons()->create(['title' => 'Setting Up Your Environment', 'type' => 'video', 'description' => 'Tools and software needed', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration_minutes' => 30, 'is_free_preview' => false, 'order' => 1]);
$l3 = $s1->lessons()->create(['title' => 'Course Materials', 'type' => 'document', 'description' => 'Downloadable resources', 'duration_minutes' => 10, 'is_free_preview' => false, 'order' => 2]);

// Resources for l1
CourseResource::create(['course_id' => $course->id, 'lesson_id' => $l1->id, 'title' => 'Course Syllabus.pdf', 'file_path' => 'courses/documents/syllabus.pdf', 'file_type' => 'document', 'file_size' => 45000]);
CourseResource::create(['course_id' => $course->id, 'lesson_id' => $l1->id, 'title' => 'Welcome Guide.pdf', 'file_path' => 'courses/documents/welcome.pdf', 'file_type' => 'document', 'file_size' => 12000]);

// Quiz for l1
$q1 = $course->quizzes()->create(['title' => 'Introduction Quiz', 'lesson_id' => $l1->id, 'order' => 0]);
CourseQuizQuestion::create(['quiz_id' => $q1->id, 'question' => 'What is the main goal of this course?', 'options' => ['Learn basics', 'Master advanced topics', 'Get certified', 'All of the above'], 'correct_answer' => 3, 'order' => 0]);
CourseQuizQuestion::create(['quiz_id' => $q1->id, 'question' => 'How many modules are there?', 'options' => ['3', '5', '7', '10'], 'correct_answer' => 1, 'order' => 1]);

// Section 2: Core Concepts
$s2 = $course->sections()->create(['title' => 'Module 2: Core Concepts', 'order' => 1]);

$l4 = $s2->lessons()->create(['title' => 'Understanding the Fundamentals', 'type' => 'video', 'description' => 'Deep dive into core principles', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration_minutes' => 45, 'is_free_preview' => false, 'order' => 0]);
$l5 = $s2->lessons()->create(['title' => 'Practical Exercises', 'type' => 'video', 'description' => 'Hands-on practice', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration_minutes' => 60, 'is_free_preview' => false, 'order' => 1]);

// Resources for l4
CourseResource::create(['course_id' => $course->id, 'lesson_id' => $l4->id, 'title' => 'Cheat Sheet.pdf', 'file_path' => 'courses/documents/cheatsheet.pdf', 'file_type' => 'document', 'file_size' => 25000]);
CourseResource::create(['course_id' => $course->id, 'lesson_id' => $l4->id, 'title' => 'Reference Guide.pdf', 'file_path' => 'courses/documents/reference.pdf', 'file_type' => 'document', 'file_size' => 80000]);
CourseResource::create(['course_id' => $course->id, 'lesson_id' => $l4->id, 'title' => 'Sample Code.zip', 'file_path' => 'courses/documents/sample.zip', 'file_type' => 'document', 'file_size' => 150000]);

// Quiz for l4
$q2 = $course->quizzes()->create(['title' => 'Core Concepts Quiz', 'lesson_id' => $l4->id, 'order' => 0]);
CourseQuizQuestion::create(['quiz_id' => $q2->id, 'question' => 'What is the first principle?', 'options' => '["Option A", "Option B", "Option C", "Option D"]', 'correct_answer' => 0, 'order' => 0]);
CourseQuizQuestion::create(['quiz_id' => $q2->id, 'question' => 'Which tool is recommended?', 'options' => '["Tool X", "Tool Y", "Tool Z", "None"]', 'correct_answer' => 1, 'order' => 1]);
CourseQuizQuestion::create(['quiz_id' => $q2->id, 'question' => 'How long does it take to master?', 'options' => '["1 week", "1 month", "6 months", "1 year"]', 'correct_answer' => 2, 'order' => 2]);

// Quiz for l5
$q3 = $course->quizzes()->create(['title' => 'Exercise Quiz', 'lesson_id' => $l5->id, 'order' => 0]);
CourseQuizQuestion::create(['quiz_id' => $q3->id, 'question' => 'Did you complete the exercise?', 'options' => '["Yes", "No", "Partially", "Not sure"]', 'correct_answer' => 0, 'order' => 0]);

// Section 3: Advanced Topics
$s3 = $course->sections()->create(['title' => 'Module 3: Advanced Techniques', 'order' => 2]);

$l6 = $s3->lessons()->create(['title' => 'Advanced Strategies', 'type' => 'video', 'description' => 'Pro-level techniques', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration_minutes' => 50, 'is_free_preview' => false, 'order' => 0]);
$l7 = $s3->lessons()->create(['title' => 'Real-World Projects', 'type' => 'video', 'description' => 'Apply what you learned', 'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'duration_minutes' => 90, 'is_free_preview' => true, 'order' => 1]);

// Resources for l6
CourseResource::create(['course_id' => $course->id, 'lesson_id' => $l6->id, 'title' => 'Advanced Notes.pdf', 'file_path' => 'courses/documents/advanced.pdf', 'file_type' => 'document', 'file_size' => 55000]);

// Quiz for l6
$q4 = $course->quizzes()->create(['title' => 'Advanced Quiz', 'lesson_id' => $l6->id, 'order' => 0]);
CourseQuizQuestion::create(['quiz_id' => $q4->id, 'question' => 'What is the key to mastery?', 'options' => '["Practice", "Theory", "Both", "Neither"]', 'correct_answer' => 2, 'order' => 0]);
CourseQuizQuestion::create(['quiz_id' => $q4->id, 'question' => 'How many hours of practice?', 'options' => '["100", "500", "1000", "10000"]', 'correct_answer' => 2, 'order' => 1]);
CourseQuizQuestion::create(['quiz_id' => $q4->id, 'question' => 'Is this course enough?', 'options' => '["Yes", "No", "Maybe", "Depends"]', 'correct_answer' => 0, 'order' => 2]);
CourseQuizQuestion::create(['quiz_id' => $q4->id, 'question' => 'Would you recommend it?', 'options' => '["Yes", "No", "Maybe", "Depends"]', 'correct_answer' => 0, 'order' => 3]);
CourseQuizQuestion::create(['quiz_id' => $q4->id, 'question' => 'Final question?', 'options' => '["A", "B", "C", "D"]', 'correct_answer' => 3, 'order' => 4]);

// Quiz for l7
$q5 = $course->quizzes()->create(['title' => 'Project Assessment', 'lesson_id' => $l7->id, 'order' => 0]);
CourseQuizQuestion::create(['quiz_id' => $q5->id, 'question' => 'Did you finish the project?', 'options' => '["Yes", "No", "In progress", "Not started"]', 'correct_answer' => 0, 'order' => 0]);
CourseQuizQuestion::create(['quiz_id' => $q5->id, 'question' => 'Rate your confidence', 'options' => '["1", "2", "3", "4"]', 'correct_answer' => 3, 'order' => 1]);

echo "=== AB Course Seeded Successfully ===\n";
echo "Course ID: " . $course->id . "\n";
echo "Title: " . $course->title . "\n";
echo "Image: " . $course->image . "\n";
echo "Sections: " . $course->sections()->count() . "\n";
echo "Lessons: " . CourseLesson::whereHas('section', fn($q) => $q->where('course_id', $course->id))->count() . "\n";
echo "Quizzes: " . $course->quizzes()->count() . "\n";
echo "Resources: " . CourseResource::where('course_id', $course->id)->count() . "\n";

foreach ($course->sections as $section) {
    echo "\n--- " . $section->title . " ---\n";
    echo "Lessons: " . $section->lessons->count() . "\n";
    $sectionQuizzes = CourseQuiz::whereIn('lesson_id', $section->lessons->pluck('id'))->count();
    echo "Quizzes: " . $sectionQuizzes . "\n";
    $totalDuration = $section->lessons->sum('duration_minutes');
    echo "Duration: " . $totalDuration . "m\n";
    $freeCount = $section->lessons->where('is_free_preview', true)->count();
    echo "Free Previews: " . $freeCount . "\n";
    
    foreach ($section->lessons as $lesson) {
        $lessonQuizzes = CourseQuiz::where('lesson_id', $lesson->id)->count();
        $lessonResources = CourseResource::where('lesson_id', $lesson->id)->count();
        echo "  > " . $lesson->title . " | " . $lessonQuizzes . " quiz | " . $lessonResources . " files | " . $lesson->duration_minutes . "m | " . ($lesson->is_free_preview ? 'FREE' : 'LOCKED') . "\n";
    }
}
