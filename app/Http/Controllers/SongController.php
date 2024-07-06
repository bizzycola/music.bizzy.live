<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Song;
use Util\AudioUtil;

class SongController extends Controller
{
    public function index() : Response {
        return Inertia::render('Songs/Index', ['songs' => Song::all()]);
    }

    public function add() {
        return Inertia::render('Songs/Add');
    }
    public function store(Request $request): RedirectResponse {
        $request->validate([
            'title' => 'required|string|max:255',
            'artist' => 'required|string|max:255',
            'album' => 'required|string|max:255',
            'songUrl' => 'required|url:http,https|max:255',
        ]);

        // Get duration from song
        $duration = AudioUtil::ParseDurationFromRemote($request->songUrl);

        $song = Song::create([
            'title' => $request->title,
            'artist' => $request->artist,
            'album' => $request->album,
            'duration' => $duration,
            'audio_file' => $request->songUrl
        ]);

        return redirect(route('songs', absolute: false));
    }

    public function edit(int $id) {
        $song = Song::find($id);
        return Inertia::render('Songs/Edit', ['song' => $song]);
    }
    public function update(Request $request): RedirectResponse {
        $request->validate([
            'id' => 'required|integer|exists:App\Models\Song,id',
            'title' => 'required|string|max:255',
            'artist' => 'required|string|max:255',
            'album' => 'required|string|max:255',
        ]);

        $song = Song::find($request->id);
        $song->title = $request->title;
        $song->artist = $request->artist;
        $song->album = $request->album;
        $song->save();

        return redirect(route('songs', absolute: false));
    }

    public function destroy(int $id): RedirectResponse {
        $song = Song::find($id);
        $song->delete();

        return redirect(route('songs', absolute: false));
    }
}
