<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$course = App\Models\Course::where('slug', 'ab-course')->first();
if (!$course) {
    echo "AB Course not found!\n";
    exit;
}

$videos = [
    'https://www.youtube.com/embed/EngW7tLk6R8' => 'Basic English Grammar Lesson 1',
    'https://www.youtube.com/embed/pqn0b3_kK_o' => 'English Pronunciation Tips',
    'https://www.youtube.com/embed/R1A3iLgKjVY' => 'Vocabulary Building Techniques',
    'https://www.youtube.com/embed/9bZkp7q19f0' => 'Speaking Practice Session',
    'https://www.youtube.com/embed/6avHGTu2rIU' => 'Writing Skills Workshop',
    'https://www.youtube.com/embed/3fumBcKCfFE' => 'Advanced Listening Comprehension',
];

$sections = $course->sections;
$videoIndex = 0;

foreach ($sections as $section) {
    foreach ($section->lessons as $lesson) {
        if ($videoIndex < count($videos)) {
            $lesson->video_url = array_keys($videos)[$videoIndex];
            $lesson->title = array_values($videos)[$videoIndex];
            $lesson->save();
            echo "Updated lesson {$lesson->id}: {$lesson->title} -> {$lesson->video_url}\n";
            $videoIndex++;
        }
    }
}

echo "Done! Updated {$videoIndex} lessons with different videos.\n";
