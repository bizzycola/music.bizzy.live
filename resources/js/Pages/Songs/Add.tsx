import { useRef, FormEventHandler } from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Add({ auth }: PageProps) {

    const titleInput = useRef<HTMLInputElement>(null);
    const artistInput = useRef<HTMLInputElement>(null);
    const albumInput = useRef<HTMLInputElement>(null);
    const songUrlInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, post, reset, processing, recentlySuccessful, progress } = useForm({
        title: '',
        artist: '',
        album: '',
        songUrl: ''
    });

    const addSong: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('songs.store'));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Add Song</h2>}
        >
            <Head title="Add Song" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={addSong} className="space-y-6 p-6" encType="multipart/form-data">
                            { /* Title */}
                            <div>
                                <InputLabel htmlFor="title" value="Title" />

                                <TextInput
                                    id="title"
                                    ref={titleInput}
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    type="text"
                                    className="mt-1 block w-full"
                                />

                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            { /* Artist */}
                            <div>
                                <InputLabel htmlFor="artist" value="Artist" />

                                <TextInput
                                    id="artist"
                                    ref={artistInput}
                                    value={data.artist}
                                    onChange={(e) => setData('artist', e.target.value)}
                                    type="text"
                                    className="mt-1 block w-full"
                                />

                                <InputError message={errors.artist} className="mt-2" />
                            </div>

                            { /* Album */}
                            <div>
                                <InputLabel htmlFor="album" value="Album" />

                                <TextInput
                                    id="album"
                                    ref={albumInput}
                                    value={data.album}
                                    onChange={(e) => setData('album', e.target.value)}
                                    type="text"
                                    className="mt-1 block w-full"
                                />

                                <InputError message={errors.album} className="mt-2" />
                            </div>

                            { /* Song URL */}
                            <div>
                                <InputLabel htmlFor="songUrl" value="Audio File" />

                                <TextInput
                                    id="songUrl"
                                    ref={songUrlInput}
                                    onChange={(e) => setData('songUrl', (e.target.files as any)[0])}
                                    type="file"
                                    className="mt-1 block w-full"
                                />

                                <InputError message={errors.songUrl} className="mt-2" />
                            </div>

                            {progress && (
                                <progress value={progress.percentage} max="100">
                                    {progress.percentage}%
                                </progress>
                            )}

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>Add</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}