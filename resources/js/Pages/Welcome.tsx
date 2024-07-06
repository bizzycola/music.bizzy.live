import { useRef, useEffect, useState } from 'react'
import { ListPlayer, ListPlayerContext, listInfo } from 'react-list-player';
import { IndexProps } from '@/types';
import '../../css/frontend.css'
function fmtMSS(s: number) { s = Math.floor(s); return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s }

export default function Welcome({ songs }: IndexProps<{ laravelVersion: string, phpVersion: string }>) {
    const [selectedTrack, setSelectedTrack] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [playerMode] = useState("large");
    const [forceSmallWidth] = useState(false);
    const [replaceHeader] = useState(false);
    const [headLess] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);

    const [testTracks, setTestTracks] = useState<any[]>([])
    const [audioSrcs, setAudioSrcs] = useState<any[]>([])
    const [testListInfo, setTestListInfo] = useState<listInfo>({
        type: 'playlist',
        name: 'Bizzy\'s Music',
        numTracks: 12,
        duration: "..."
    })

    /* ==== */
    useEffect(() => {
        let tempTracks = []
        let tempAudio = []
        let totalSeconds = 0
        let totalMinutes = 0
        for (let i = 0; i < songs.length; i++) {
            const song = songs[i]

            tempTracks.push({
                title: [
                    {
                        type: 'text',
                        content: song.title,
                        className: 'title'
                    }
                ],
                artist: [
                    {
                        type: 'text',
                        content: song.artist,
                        className: 'artist',
                    }
                ],
                album: [
                    {
                        type: 'text',
                        content: song.album,
                        className: 'album'
                    }
                ],
                duration: fmtMSS(song.duration),
                imageSrc: "https://cdn.bizztech.xyz/music/BizzyPlosh.png"
            })

            tempAudio.push(song.audio_file)

            totalSeconds += song.duration
            totalMinutes += totalSeconds / 60

        }

        setTestTracks(tempTracks)
        setAudioSrcs(tempAudio)

        setTestListInfo({
            type: 'playlist',
            name: 'BizzyMusic',
            numTracks: 12,
            duration: `${fmtMSS(totalSeconds)}`
        })
    }, [])
    /* === */

    const handleOnPlay = (index: number, resume: boolean) => {
        if (index === selectedTrack && !resume) {
            audioRef.current?.load();
            audioRef.current?.play();
        } else {
            audioRef.current?.play();
        }
    }

    const handleOnPause = () => {
        audioRef.current?.pause();
    }

    return (
        <>
            <div className="card w-full">
                <ListPlayerContext.Provider value={{ selectedTrack, setSelectedTrack, isPlaying, setIsPlaying, isMuted, setIsMuted }}>
                    <div className="app mPlayer">
                        <div className='listplayer-cont' style={forceSmallWidth ? { paddingLeft: "20%", paddingRight: "20%" } : undefined}>
                            <ListPlayer
                                tracks={testTracks}
                                listInfo={testListInfo}
                                playerMode={playerMode}
                                noControls={replaceHeader}
                                noHeader={headLess}
                                playCallback={handleOnPlay}
                                pauseCallback={handleOnPause}
                                loop
                                kbdShortcuts
                            ></ListPlayer>
                        </div>
                    </div>
                    <audio ref={audioRef}
                        src={selectedTrack < audioSrcs.length ? audioSrcs[selectedTrack % audioSrcs.length] : undefined}
                        muted={isMuted}
                        onEnded={() => { setSelectedTrack(selectedTrack + 1) }}
                    />
                </ListPlayerContext.Provider>
            </div>
        </>
    );
}
