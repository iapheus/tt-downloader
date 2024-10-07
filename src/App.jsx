import React, { useState } from 'react';
import FingerSvg from './components/FingerSvg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const tiktokUrlPattern = /^https:\/\/www\.tiktok\.com\/@[^\/]+\/video\/\d+$/;
  const navigate = useNavigate();

  const handleError = () => {
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 2000);
  } 
  
  const handleLoading = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
    }, 1500);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const value = userInput.trim();

    if (value.startsWith('@')) {
      const username = value.substring(1).trim();
      
      if (username) {
        navigate(`/profile/${username}`)
      } else {
        handleError();
      }
    } else {
      handleError();
    }
  }

  const handleDownload = async (e) => {
    e.preventDefault();
    const value = userInput.trim();

    if(tiktokUrlPattern.test(value)) {
      handleLoading();
      const resp = await axios.post('https://tikwm.com/api/', {
        'url': value,
        'count': '12',
        'cursor': '0',
        'web': '1',
        'hd': '1'
      })
      window.location.href = 'https://tikwm.com' + resp.data.data.play;
    } else {
      handleError();
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-screen">
      <div className="mt-10 mb-5">
        <FingerSvg />
      </div>
      <h1 className='text-xl text-white font-mono font-semibold mb-2'>Download any TikTok Video</h1>
      {error && <h1 className='text-xl text-red-500 font-mono font-semibold mb-2'>Invalid format. Please enter a valid TikTok URL or @username</h1>}
      {downloading && <div className='loader my-2'></div>}
      <div className="w-80">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className='-ml-2' width="24" height="24" viewBox="0 0 20 24">
              <path fill="currentColor" d="M9.539 15.23q-2.398 0-4.065-1.666Q3.808 11.899 3.808 9.5t1.666-4.065T9.539 3.77t4.064 1.666T15.269 9.5q0 1.042-.369 2.017t-.97 1.668l5.909 5.907q.14.14.15.345q.009.203-.15.363q-.16.16-.354.16t-.354-.16l-5.908-5.908q-.75.639-1.725.989t-1.96.35m0-1q1.99 0 3.361-1.37q1.37-1.37 1.37-3.361T12.9 6.14T9.54 4.77q-1.991 0-3.361 1.37T4.808 9.5t1.37 3.36t3.36 1.37"/>
            </svg>
          </div>
          <input
            type="text"
            className={`outline-none border-2 ${error && 'border-red-500'} bg-white block w-full pl-10 p-2.5 rounded-full`}
            placeholder="@username or video url"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </div>
        <div className="flex justify-center space-x-5">
          <button onClick={handleSearch} className="w-28 h-10 font-semibold bg-white rounded-full drop-shadow-2xl hover:bg-slate-300">Search</button>
          <button onClick={handleDownload} className="w-28 h-10 font-semibold bg-white rounded-full drop-shadow-2xl hover:bg-slate-300">Download</button>
        </div>
      </div>
      <div className="mt-6">
        <button className="w-40 h-10 border-2 border-yellow-300 drop-shadow-2xl hover:bg-orange-100 bg-white rounded-full flex items-center justify-center space-x-2">
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <path fill="currentColor" d="M160 58H64a14 14 0 0 0-14 14v152a6 6 0 0 0 9.49 4.88L112 191.37l52.52 37.51A6 6 0 0 0 174 224V72a14 14 0 0 0-14-14m2 154.34l-46.52-33.22a6 6 0 0 0-7 0L62 212.34V72a2 2 0 0 1 2-2h96a2 2 0 0 1 2 2ZM206 40v152a6 6 0 0 1-12 0V40a2 2 0 0 0-2-2H88a6 6 0 0 1 0-12h104a14 14 0 0 1 14 14"/>
          </svg>
          <p className='font-semibold' onClick={() => {navigate('/favorites')}}>Favorites</p>
        </button>
      </div>
    </div>
  );
}

export default App;
