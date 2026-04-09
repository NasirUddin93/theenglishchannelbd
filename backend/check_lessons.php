<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Verifying AB course lesson 276:\n";
$lesson = App\Models\CourseLesson::with(['resources', 'quizzes'])->find(276);
if ($lesson) {
    echo "  Title: {$lesson->title}\n";
    echo "  Resources count: " . $lesson->resources->count() . "\n";
    echo "  Quizzes count: " . $lesson->quizzes->count() . "\n";
    echo "  Section: {$lesson->section->title}\n";
} else {
    echo "  Not found!\n";
}

echo "\nVerifying course 1 (IELTS) lesson 1:\n";
$lesson = App\Models\CourseLesson::with(['resources', 'quizzes'])->find(1);
if ($lesson) {
    echo "  Title: {$lesson->title}\n";
    echo "  Resources count: " . $lesson->resources->count() . "\n";
    echo "  Quizzes count: " . $lesson->quizzes->count() . "\n";
} else {
    echo "  Not found!\n";
}
