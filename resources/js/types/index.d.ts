
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export interface Song {
    id: number;
    title: string;
    artist: string;
    album: string;
    duration: number;
    audio_file: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};

export type SongsProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    songs: Song[]
};

export type EditSongProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    song: Song
};

export type IndexProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    songs: Song[]
};