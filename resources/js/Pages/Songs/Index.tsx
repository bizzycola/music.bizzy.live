import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { SongsProps } from '@/types';

export default function Index({ auth, songs }: SongsProps) {
    console.log('songs', songs)

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Songs</h2>}
        >
            <Head title="Songs" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col">
                    <Link href={route('songs.add')} className='text-gray-50 p-2 bg-indigo-500 rounded-md ml-auto hover:bg-indigo-600'>Add Song</Link>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-gray-50 mt-5">
                        <div className='flex flex-col divide-y divide-gray-600'>
                            {songs.map(song => (
                                <div className='flex flex-row gap-4 py-4'>
                                    <div className='flex flex-col'>
                                        <span className='text-xl'>{song.title}</span>
                                        <div className='flex flex-row gap-2 py-2 text-sm text-gray-300'>
                                            <span>{song.artist}</span> | 
                                            <span>{song.album}</span>
                                        </div>
                                    </div>

                                    <div className='ml-auto flex flex-row items-center justify-center gap-2'>
                                        <Link 
                                            href={route('songs.edit', {id: song.id})} 
                                            className='text-gray-50 p-2 bg-indigo-500 rounded-md ml-auto hover:bg-indigo-600'>
                                                Edit
                                        </Link>
                                        <Link 
                                            href={route('songs.destroy', {id: song.id})} 
                                            className='text-gray-50 p-2 bg-red-500 rounded-md ml-auto hover:bg-red-600'>
                                                Delete
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}