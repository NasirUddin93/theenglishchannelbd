<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$books = App\Models\Book::where('is_featured', 1)
    ->orderBy('id', 'desc')
    ->get(['id','title','status','is_featured','created_at'])
    ->toArray();
echo json_encode($books, JSON_PRETTY_PRINT);
