<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SongController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Song;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'songs' => Song::all()
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Song routes
Route::middleware(['auth', 'verified'])->controller(SongController::class)->group(function () {
    Route::get('/songs', 'index')->name('songs');
    
    Route::get('/songs/add', 'add')->name('songs.add');
    Route::post('songs/add', 'store')->name('songs.store');

    Route::get('/songs/destroy/{id}', 'destroy')->name('songs.destroy');

    Route::post('/songs/save', 'update')->name('songs.save');
    Route::get('/songs/{id}', 'edit')->name('songs.edit');
    
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
