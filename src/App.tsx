import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-sans selection:bg-fuchsia-500 selection:text-black flex flex-col items-center py-8 px-4 relative overflow-hidden">
      <div className="scanlines" />
      <div className="noise" />

      <header className="w-full max-w-5xl flex flex-col md:flex-row items-start md:items-center justify-between mb-8 z-10 border-b-4 border-fuchsia-500 pb-4">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <Terminal className="w-10 h-10 text-fuchsia-500 animate-pulse" />
          <h1 className="text-2xl md:text-4xl font-mono tracking-tighter glitch" data-text="SYS.SNAKE_PROTOCOL">
            SYS.SNAKE_PROTOCOL
          </h1>
        </div>
        
        <div className="flex gap-8 font-mono text-lg md:text-xl">
          <div className="flex flex-col items-end">
            <span className="text-fuchsia-500">SCORE_VAL</span>
            <span className="text-cyan-400">{score.toString().padStart(4, '0')}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-fuchsia-500">MAX_VAL</span>
            <span className="text-cyan-400">{highScore.toString().padStart(4, '0')}</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-5xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 z-10">
        <div className="flex-1 flex justify-center w-full border-4 border-cyan-400 p-2 bg-black shadow-[8px_8px_0px_#f0f]">
          <SnakeGame onScoreChange={handleScoreChange} onGameOver={() => {}} />
        </div>

        <div className="w-full lg:w-96 flex flex-col gap-8">
          <div className="border-4 border-fuchsia-500 p-2 bg-black shadow-[8px_8px_0px_#0ff]">
            <h2 className="font-mono text-lg text-black bg-fuchsia-500 p-2 uppercase tracking-widest flex items-center justify-between mb-4">
              <span>AUDIO_SYS</span>
              <span className="animate-ping">_</span>
            </h2>
            <MusicPlayer />
          </div>

          <div className="flex flex-col gap-2 p-4 border-4 border-cyan-400 bg-black shadow-[8px_8px_0px_#f0f]">
            <h3 className="font-mono text-fuchsia-500 uppercase border-b-2 border-fuchsia-500 pb-2 mb-2">SYS_DIAGNOSTICS</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-cyan-400">MEM_LEAK</span>
                <span className="text-fuchsia-500 animate-pulse">DETECTED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-400">NEURAL_NET</span>
                <span className="text-cyan-400">CORRUPT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-400">OVERRIDE</span>
                <span className="text-fuchsia-500">ENGAGED</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
