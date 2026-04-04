<?php
require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);

// Start timing
$start = microtime(true);

// Test database connection
try {
    $books = \App\Models\Book::select('id', 'title', 'author', 'price', 'image', 'category_id')
        ->with(['category' => function($q) {
            $q->select('id', 'name');
        }])
        ->where('status', 'approved')
        ->limit(20)
        ->get();
    
    $dbTime = microtime(true);
    echo "Database Query Time: " . number_format(($dbTime - $start) * 1000, 2) . " ms\n";
    echo "Books fetched: " . count($books) . "\n";
    echo "Total time: " . number_format((microtime(true) - $start) * 1000, 2) . " ms\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
