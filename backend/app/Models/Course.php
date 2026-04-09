<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'instructor',
        'description',
        'syllabus',
        'price',
        'duration_hours',
        'lessons_count',
        'level',
        'image',
        'preview_video',
        'is_featured',
        'is_active',
        'category',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'duration_hours' => 'integer',
        'lessons_count' => 'integer',
    ];

    public function sections() { return $this->hasMany(CourseSection::class)->orderBy('order'); }
    public function resources() { return $this->hasMany(CourseResource::class); }
    public function quizzes() { return $this->hasMany(CourseQuiz::class)->whereNull('lesson_id')->orderBy('order'); }
    public function reviews() { return $this->hasMany(CourseReview::class); }
    public function questions() { return $this->hasMany(CourseQuestion::class); }
}
