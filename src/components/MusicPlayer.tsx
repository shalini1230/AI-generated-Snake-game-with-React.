import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "ERR_01:VOID",
    artist: "UNKNOWN_ENTITY",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "CORRUPT_SECTOR",
    artist: "SYS_ADMIN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "FATAL_EXCEPTION",
    artist: "NULL_PTR",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => {
        console.error("Playback failed:", e);
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  return (
    <div className="w-full bg-black flex flex-col gap-4 font-sans">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
      
      <div className="border-b-2 border-cyan-400 pb-2">
        <h3 className="text-fuchsia-500 text-2xl truncate uppercase font-mono">
          &gt; {currentTrack.title}
        </h3>
        <p className="text-cyan-400 text-lg truncate uppercase mt-1">
          AUTHOR: {currentTrack.artist}
        </p>
      </div>

      <div className="w-full h-6 border-2 border-fuchsia-500 bg-black relative">
        <div 
          className="h-full bg-cyan-400 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2 font-mono text-sm">
        <button 
          onClick={handlePrev}
          className="px-4 py-2 bg-black border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black uppercase transition-colors"
        >
          [PREV]
        </button>
        
        <button 
          onClick={togglePlay}
          className="px-6 py-2 bg-fuchsia-500 text-black font-bold hover:bg-cyan-400 uppercase transition-colors"
        >
          {isPlaying ? 'HALT' : 'EXEC'}
        </button>
        
        <button 
          onClick={handleNext}
          className="px-4 py-2 bg-black border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black uppercase transition-colors"
        >
          [NEXT]
        </button>
      </div>
    </div>
  );
};
