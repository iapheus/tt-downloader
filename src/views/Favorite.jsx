import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

function Favorite() {
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState({});

    useEffect(() => {
        const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedVideos') || '[]');
        setVideos(storedBookmarks);
    }, []);

    useEffect(() => {
        if (selectedVideo) {
            const player = videojs('video-player', {}, () => {
                console.log('Player is ready');
            });
            player.src({ src: 'https://tikwm.com' + selectedVideo.play, type: 'video/mp4' });

            return () => {
                if (player) {
                    player.dispose();
                }
            };
        }
    }, [selectedVideo]);

    const handleDownload = (video) => {
        window.location.href = 'https://tikwm.com' + video.play;
    };

    const handleBookmark = (video) => {
        const updatedVideos = videos.filter(v => v.play !== video.play);
        localStorage.setItem('bookmarkedVideos', JSON.stringify(updatedVideos));
        setVideos(updatedVideos);
    };

    const goBack = () => {
        navigate(-1);
    };

    const handleVideoClick = (video) => {
        if (window.innerWidth < 768) {
            window.open('https://tikwm.com' + video.play, '_blank');
        } else {
            setSelectedVideo(video);
        }
    };

    const closeVideoModal = () => {
        setSelectedVideo(null);
    };

    const toggleBulkMode = () => {
        setIsBulkMode(!isBulkMode);
        if (isBulkMode) {
            setSelectedCheckboxes({});
        }
    };

    const handleCheckboxChange = (video) => {
        setSelectedCheckboxes(prev => ({
            ...prev,
            [video.play]: !prev[video.play]
        }));
    };

    const handleBulkDownload = () => {
        Object.keys(selectedCheckboxes).forEach(key => {
            if (selectedCheckboxes[key]) {
                window.open('https://tikwm.com' + videos.find(v => v.play === key).play, '_blank');
            }
        });
    };

    return (
        <div>
            <div className='flex justify-between items-center p-4'>
                <button onClick={goBack} className='p-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                        <path fill="#888888" d="m7.825 13l4.9 4.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-6.6-6.6q-.15-.15-.213-.325T4.426 12t.063-.375t.212-.325l6.6-6.6q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712L7.825 11H19q.425 0 .713.288T20 12t-.288.713T19 13z"/>
                    </svg>
                </button>
                <h1 className='text-center text-3xl text-white font-mono mb-5 mt-5 flex-1'>Favorites</h1>
                <div className='flex space-x-2'>
                    <button 
                        onClick={toggleBulkMode} 
                        className={`p-2 rounded-md ${isBulkMode ? 'bg-red-600 text-white' : 'bg-gray-600 text-white'} hover:bg-opacity-80 transition-colors`}
                    >
                        {isBulkMode ? 'Cancel' : 'Bulk'}
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
            </div>
            {videos.length === 0 ? (
                <p className='text-center text-white'>There are no favorite videos.</p>
            ) : (
            <div className='mx-5 lg:mx-32'>
                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4'>
                    {videos.map((video, index) => (
                        <div key={index} className='relative w-full bg-gray-100 p-2 rounded-lg overflow-hidden'>
                            {isBulkMode && (
                                <input
                                    type="checkbox"
                                    checked={!!selectedCheckboxes[video.play]}
                                    onChange={() => handleCheckboxChange(video)}
                                    className='absolute top-2 right-2 w-6 h-6 accent-blue-600'
                                />
                            )}
                            <img 
                                onClick={() => handleVideoClick(video)} 
                                className='w-full object-cover rounded-lg cursor-pointer' 
                                src={'https://tikwm.com' + video.cover} 
                                alt={video.title} 
                            />
                            <p className='truncate mt-2'>{video.title}</p>
                            <div className='flex space-x-2 justify-center mt-2'>
                                <button 
                                    onClick={() => handleDownload(video)} 
                                    className='p-2 rounded-md'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15c0 2.828 0 4.243.879 5.121C4.757 21 6.172 21 9 21h6c2.828 0 4.243 0 5.121-.879C21 19.243 21 17.828 21 15M12 3v13m0 0l4-4.375M12 16l-4-4.375"/>
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => handleBookmark(video)} 
                                    className='p-2 rounded-md'
                                >
                                    {videos.some(b => b.play === video.play) ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="#888888" d="M17.825 9L15 6.175l1.4-1.425l1.425 1.425l3.525-3.55l1.425 1.425zM5 21V5q0-.825.588-1.412T7 3h7q-.5.75-.75 1.438T13 6q0 1.8 1.138 3.175T17 10.9q.575.075 1 .075t1-.075V21l-7-3z"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M17.825 9L15 6.175l1.4-1.425l1.425 1.425l3.525-3.55l1.425 1.425zM5 21V5q0-.825.588-1.412T7 3h7q-.5.75-.75 1.438T13 6q0 1.8 1.138 3.175T17 10.9q.575.075 1 .075t1-.075V21l-7-3z"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            )}

            {selectedVideo && window.innerWidth >= 768 && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50'
                    onClick={closeVideoModal}
                >
                    <div
                        className='relative bg-black p-6'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={closeVideoModal} className='absolute top-2 right-0 text-white text-3xl cursor-pointer'>
                            ×
                        </button>
                        <video
                            id="video-player"
                            className="video-js vjs-default-skin"
                            controls
                            autoPlay
                            playsInline
                            width="640"
                            height="360"
                        >
                            <source src={'https://tikwm.com' + selectedVideo.play} type="video/mp4" />
                        </video>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Favorite;
