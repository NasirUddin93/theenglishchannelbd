<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'title',
        'author',
        'description',
        'price',
        'stock',
        'stock_threshold',
        'isbn',
        'publisher',
        'image',
        'pages',
        'language',
        'format',
        'is_featured',
        'average_rating',
        'status',
        'preview_content',
        'preview_images',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'average_rating' => 'decimal:1',
        'is_featured' => 'boolean',
        'preview_content' => 'array',
        'preview_images' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
