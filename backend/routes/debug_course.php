<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

header('Content-Type: application/json');
$course = App\Models\Course::with([
    'sections.lessons.resources',
    'sections.lessons.quizzes.questions',
])->where('slug', 'ab-course')->where('is_active', true)->firstOrFail();

echo json_encode($course, JSON_PRETTY_PRINT);
