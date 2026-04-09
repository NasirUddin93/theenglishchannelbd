<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$books = App\Models\Book::whereNotNull('image')->where('image', 'like', '%http%')->get();

foreach ($books as $book) {
    $parsed = parse_url($book->image);
    $pathParts = explode('/', ltrim($parsed['path'] ?? '', '/'));
    $storageIndex = array_search('storage', $pathParts);
    if ($storageIndex !== false) {
        $book->image = implode('/', array_slice($pathParts, $storageIndex + 1));
        $book->save();
        echo "Fixed: {$book->title} -> {$book->image}\n";
    }
}

echo "Updated " . $books->count() . " books\n";
