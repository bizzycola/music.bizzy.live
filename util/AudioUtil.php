<?php
namespace Util;

use Illuminate\Support\Facades\Log;
use \getID3;

class AudioUtil
{
    /**
     * Parse a remote audio file and return the duration in seconds
     * @param string $remotefilename URL of the remote audio file
     * @return int Duration in seconds
     */
    public static function ParseDurationFromRemote(string $remotefilename): int
    {
        $duration = 0;

        try {
            // Pull remote file into a temp local file
            if ($fp_remote = fopen($remotefilename, 'rb')) {
                $localtempfilename = tempnam('/tmp', 'bmusid3');
                if ($fp_local = fopen($localtempfilename, 'wb')) {
                    while ($buffer = fread($fp_remote, 8192)) {
                        fwrite($fp_local, $buffer);
                    }
                    fclose($fp_local);
                    
                    // Initialize getID3 engine
                    $getID3 = new getID3;
                    $ThisFileInfo = $getID3->analyze($localtempfilename);
                    $duration = (int)$ThisFileInfo['playtime_seconds'];

                    // Delete temporary file
                    unlink($localtempfilename);
                }
                fclose($fp_remote);
            }
        } catch (\Exception $e) {
            Log::error('[AudioUtil] URL duration parse failed: ' . $e);
        }

        return $duration;
    }
}
