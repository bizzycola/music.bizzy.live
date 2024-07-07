<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

/**
 * Manage DigitalOcean CDN services.
 */
class DOCdnService implements CdnService
{
    /**
     * Purge the specified object from the
     * CDN cache.
     */
    public function purge($fileName)
    {
        $folder = config('filesystems.do.folder');
        Http::asJson()->delete(
            config('filesystems.do.cdn_endpoint') . '/cache',
            [
                'files' => ["{$folder}/{$fileName}"],
            ]
        );
    }
}
