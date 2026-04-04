<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutPage;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    public function show()
    {
        $about = AboutPage::first();

        if (!$about) {
            $about = AboutPage::create([
                'title' => 'About Lumina Books',
                'hero_description' => 'Your premier destination for literary discoveries and timeless classics.',
                'our_story' => 'Founded with a passion for literature, Lumina Books has grown from a small community bookstore into a trusted online destination for book lovers worldwide. Our journey began with a simple belief that great stories deserve to be shared with everyone.',
                'our_mission' => 'To connect readers with exceptional books while fostering a love for reading across all ages and backgrounds.',
                'our_values' => 'We believe in quality over quantity, carefully curating our collection to ensure every book meets our high standards. Our commitment to customer satisfaction drives everything we do.',
                'contact_email' => 'contact@luminabooks.com',
                'contact_phone' => '+1 (555) 123-4567',
                'contact_address' => '123 Book Street, Reading City, RC 12345',
            ]);
        }

        return response()->json($about);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'hero_description' => 'sometimes|string',
            'our_story' => 'sometimes|string',
            'our_mission' => 'sometimes|string',
            'our_values' => 'sometimes|string',
            'contact_email' => 'nullable|string|email',
            'contact_phone' => 'nullable|string',
            'contact_address' => 'nullable|string',
        ]);

        $about = AboutPage::first();

        if (!$about) {
            $about = AboutPage::create($validated);
        } else {
            $about->update($validated);
        }

        return response()->json([
            'about' => $about,
            'message' => 'About page updated successfully',
        ]);
    }
}
