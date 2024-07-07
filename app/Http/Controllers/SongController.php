<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\File;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Song;
use App\Services\CdnService;
use Illuminate\Support\Facades\Log;
use Util\AudioUtil;


class SongController extends Controller
{
    private $cdnService;

    public function __construct(CdnService $cdnService)
    {
        $this->cdnService = $cdnService;
    }

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
            'songUrl' => 'required|file|extensions:mp3,wav,ogg|mimes:mp3,wav,ogg',
        ]);

        // Store file locally
        $folder = config('filesystems.disks.do.folder');
        $url = config('filesystems.disks.do.endpoint_url');

        $file = $request->file('songUrl');
        $fileName = $file->hashName();
        $path = Storage::disk('local')->path(Storage::putFile('temp', $file));
        
        // Get duration from song
        $duration = AudioUtil::ParseDurationFromFile($path);

        // Move file to object storage
        $s3Path = Storage::disk('do')->putFile($folder, new File($path));

        // Remove local file
        Storage::disk('local')->delete("temp/$fileName");

        Song::create([
            'title' => $request->title,
            'artist' => $request->artist,
            'album' => $request->album,
            'duration' => $duration,
            'audio_file' => "$url/$s3Path"
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

        // Delete object storage file
        $url = config('filesystems.disks.do.endpoint_url');
        $folder = config('filesystems.disks.do.folder');

        $path = str_replace($url, "", $song->audio_file);
        $fileName = str_replace("$url/$folder/", "", $song->audio_file);

        // Delete the file from DO and purge cache
        Storage::disk('do')->delete($path);
        $this->cdnService->purge($fileName);

        $song->delete();

        return redirect(route('songs', absolute: false));
    }
}
