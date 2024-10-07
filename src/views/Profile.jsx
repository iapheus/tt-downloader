import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Profile() {
    const { username } = useParams();
    const [videos, setVideos] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profilePicture, setProfilePicture] = useState('');
    const [bookmarked, setBookmarked] = useState([]);
    const [error, setError] = useState(null);
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [selectedVideos, setSelectedVideos] = useState(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedVideos') || '[]');
        setBookmarked(storedBookmarks);
    }, []);

    const fetchVideos = async () => {
        if (!username) return;

        try {
            setLoading(true);
            const resp = await axios.post('https://tikwm.com/api/user/posts', {
                'unique_id': username,
                'count': '8',
                'cursor': cursor || '0',
                'web': '1',
                'hd': '1'
            });

            if (resp.data.code === 0) {
                setProfilePicture('https://tikwm.com/' + resp.data.data.videos[0].author.avatar);
                setVideos(prevVideos => [...prevVideos, ...resp.data.data.videos]);
                setCursor(resp.data.data.hasMore ? resp.data.data.cursor : null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [username, cursor]);

    const handleBookmark = (video) => {
        setBookmarked(prev => {
            const isBookmarked = prev.some(b => b.play === video.play);
            const updatedBookmarks = isBookmarked ? prev.filter(b => b.play !== video.play) : [...prev, { play: video.play, title: video.title, cover: video.cover }];

            localStorage.setItem('bookmarkedVideos', JSON.stringify(updatedBookmarks));
            return updatedBookmarks;
        });
    };

    const handleDownload = (video) => {
        const link = document.createElement('a');
        link.href = 'https://tikwm.com' + video.play;
        link.download = video.title || 'video';
        link.click();
    };

    const toggleBulkMode = () => {
        setIsBulkMode(!isBulkMode);
        setSelectedVideos(new Set());
    };

    const handleVideoSelection = (video) => {
        setSelectedVideos(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(video)) {
                newSelection.delete(video);
            } else {
                newSelection.add(video);
            }
            return newSelection;
        });
    };

    const handleBulkDownload = () => {
        selectedVideos.forEach(video => {
            window.open('https://tikwm.com' + video.play, '_blank');
        });
    };

    const loadMoreVideos = () => {
        if (cursor) {
            fetchVideos(); 
        }
    };

    const goBack = () => {
        navigate(-1); 
    };

    const handleVideoClick = (video) => {
        if (window.innerWidth < 768) {
            window.open('https://tikwm.com' + video.play, '_blank');
        }
    };

    return (
        <div>
            {loading && <p>Yükleniyor...</p>}
            {videos.length === 0 && !loading && !error && <p>Hiç video bulunamadı.</p>}
            <div className='mx-5 lg:mx-32'>
            <button onClick={goBack} className='p-2 mt-5'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                        <path fill="#888888" d="m7.825 13l4.9 4.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-6.6-6.6q-.15-.15-.213-.325T4.426 12t.063-.375t.212-.325l6.6-6.6q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712L7.825 11H19q.425 0 .713.288T20 12t-.288.713T19 13z"/>
                    </svg>
                </button>
                <img src={profilePicture} className='mx-auto mb-5 -mt-10 h-48 hover:shadow-lg hover:shadow-blue-300' alt="Profile" />
                <h1 className='text-center text-white font-mono text-2xl mb-2'>{username}</h1>
                <div className='flex justify-center space-x-2 mb-4'>
                    <button 
                        onClick={toggleBulkMode} 
                        className={`p-2 rounded-md ${isBulkMode ? 'bg-red-600 text-white' : 'bg-gray-600 text-white'} hover:bg-opacity-80 transition-colors`}
                    >
                        {isBulkMode ? 'Cancel' : 'Bulk Select Mode'}
                    </button>
                    {isBulkMode && (
                        <button 
                            onClick={handleBulkDownload} 
                            className='p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15c0 2.828 0 4.243.879 5.121C4.757 21 6.172 21 9 21h6c2.828 0 4.243 0 5.121-.879C21 19.243 21 17.828 21 15M12 3v13m0 0l4-4.375M12 16l-4-4.375"/>
                            </svg>
                        </button>
                    )}
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
                    {videos.map((video, index) => (
                        <div key={index} className='w-full bg-gray-100 p-2 rounded-lg'>
                            <img onClick={() => handleVideoClick(video)}  className='w-full object-cover rounded-lg' src={'https://tikwm.com' + video.cover} alt={video.title} />
                            <p className='truncate mt-2'>{video.title}</p>
                            <div className='flex space-x-2 justify-center mt-2'>
                                {isBulkMode && (
                                    <input 
                                        type='checkbox' 
                                        checked={selectedVideos.has(video)}
                                        onChange={() => handleVideoSelection(video)} 
                                        className='mr-2'
                                    />
                                )}
                                <button onClick={() => handleDownload(video)} className='p-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15c0 2.828 0 4.243.879 5.121C4.757 21 6.172 21 9 21h6c2.828 0 4.243 0 5.121-.879C21 19.243 21 17.828 21 15M12 3v13m0 0l4-4.375M12 16l-4-4.375"/>
                                    </svg>
                                </button>
                                <button onClick={() => handleBookmark(video)} className='p-2'>
                                    {bookmarked.some(b => b.play === video.play) ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#888888" d="M17.825 9L15 6.175l1.4-1.425l1.425 1.425l3.525-3.55l1.425 1.425zM5 21V5q0-.825.588-1.412T7 3h7q-.5.75-.75 1.438T13 6q0 1.8 1.138 3.175T17 10.9q.575.075 1 .075t1-.075V21l-7-3z"/></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="current" d="m12 18l-7 3V3h8v2H7v12.95l5-2.15l5 2.15V11h2v10zM7 5h6zm10 4V7h-2V5h2V3h2v2h2v2h-2v2z"/></svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {cursor && (
                    <div className='text-center mt-4'>
                        <button 
                            onClick={loadMoreVideos} 
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
                            Daha Fazla Yükle
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
