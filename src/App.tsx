import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, BookOpen, VolumeX, Download, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

const JUZ_LINKS = [
  "https://j.mp/2b8SiNO",
  "https://j.mp/2b8RJmQ",
  "https://j.mp/2bFSrtF",
  "https://j.mp/2b8SXi3",
  "https://j.mp/2b8RZm3",
  "https://j.mp/28MBohs",
  "https://j.mp/2bFRIZC",
  "https://j.mp/2bufF7o",
  "https://j.mp/2byr1bu",
  "https://j.mp/2bHfyUH",
  "https://j.mp/2bHf80y",
  "https://j.mp/2bWnTby",
  "https://j.mp/2bFTiKQ",
  "https://j.mp/2b8SUTA",
  "https://j.mp/2bFRQIM",
  "https://j.mp/2b8SegG",
  "https://j.mp/2brHsFz",
  "https://j.mp/2b8SCfc",
  "https://j.mp/2bFSq95",
  "https://j.mp/2brI1zc",
  "https://j.mp/2b8VcBO",
  "https://j.mp/2bFRxNP",
  "https://j.mp/2brItxm",
  "https://j.mp/2brHKw5",
  "https://j.mp/2brImlf",
  "https://j.mp/2bFRHF2",
  "https://j.mp/2bFRXno",
  "https://j.mp/2brI3ai",
  "https://j.mp/2bFRyBF",
  "https://j.mp/2bFREcc"
];

export default function App() {
  const [currentJuz, setCurrentJuz] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingJuz, setDownloadingJuz] = useState<number | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleDownload = async (e: React.MouseEvent, url: string, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (downloadingJuz !== null) return;
    
    setDownloadingJuz(index);
    try {
      const filename = `Juz_${index + 1}.mp3`;
      
      // 1. Resolve the final URL through our proxy to bypass redirect CORS issues
      const resolveRes = await fetch(`/api/resolve?url=${encodeURIComponent(url)}`);
      if (!resolveRes.ok) throw new Error("Failed to resolve URL");
      const { url: finalUrl } = await resolveRes.json();
      
      // 2. Fetch the actual audio file directly from archive.org (which supports CORS)
      const audioRes = await fetch(finalUrl);
      if (!audioRes.ok) throw new Error("Failed to download audio");
      
      // 3. Get the blob and trigger download
      const blob = await audioRes.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up the object URL after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (error) {
      console.error("Download failed, opening in new tab", error);
      window.open(url, '_blank');
    } finally {
      setDownloadingJuz(null);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || currentJuz === null) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const playJuz = (index: number) => {
    if (currentJuz === index) {
      handlePlayPause();
      return;
    }
    
    setCurrentJuz(index);
    setIsPlaying(true);
    setIsLoading(true);
    setProgress(0);
    
    // Audio src will update via state, we need to play it after it loads
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(e => {
          console.error("Playback failed", e);
          setIsPlaying(false);
          setIsLoading(false);
        });
      }
    }, 50);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-32">
      {/* Header */}
      <header className="bg-emerald-800 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center justify-center gap-4">
          <BookOpen size={48} className="text-emerald-300" />
          <h1 className="text-4xl font-bold tracking-wide font-serif">القرآن الكريم</h1>
          <p className="text-emerald-100 text-center max-w-lg mt-2">
            أجزاء القرآن الكريم كاملة ثلاثون جزءا مرتبة، ما عليك سوى الضغط على رقم الجزء والإستماع دون الحاجة إلى تحميل أو تنزيل. أسال الله أن ينفع به الجميع.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {JUZ_LINKS.map((link, index) => {
            const isActive = currentJuz === index;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className={`relative flex flex-col items-center justify-center p-6 rounded-2xl shadow-sm border-2 transition-all ${
                  isActive 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-200 shadow-lg' 
                    : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-400 hover:text-emerald-800 hover:shadow-md'
                }`}
              >
                <button
                  onClick={(e) => handleDownload(e, link, index)}
                  disabled={downloadingJuz !== null}
                  className={`absolute top-3 left-3 p-2 rounded-full transition-colors z-10 ${
                    isActive 
                      ? 'text-emerald-200 hover:text-white hover:bg-emerald-500' 
                      : 'text-stone-400 hover:text-emerald-600 hover:bg-emerald-100'
                  } ${downloadingJuz === index ? 'opacity-100' : downloadingJuz !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="تحميل الجزء"
                >
                  {downloadingJuz === index ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Download size={20} />
                  )}
                </button>
                
                <div 
                  className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
                  onClick={() => playJuz(index)}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${
                    isActive ? 'bg-emerald-500 text-white' : 'bg-stone-100 text-emerald-600'
                  }`}>
                    {isActive && isPlaying ? (
                      <div className="flex gap-1 items-end h-5">
                        <motion.div animate={{ height: ["4px", "16px", "4px"] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 bg-current rounded-full" />
                        <motion.div animate={{ height: ["8px", "20px", "8px"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-current rounded-full" />
                        <motion.div animate={{ height: ["12px", "4px", "12px"] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1 bg-current rounded-full" />
                      </div>
                    ) : isActive && !isPlaying ? (
                      <Pause size={24} fill="currentColor" />
                    ) : (
                      <Play size={24} className="ml-1" fill="currentColor" />
                    )}
                  </div>
                  <span className="font-bold text-xl">الجزء {index + 1}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Audio Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <audio
            ref={audioRef}
            src={currentJuz !== null ? JUZ_LINKS[currentJuz] : undefined}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => { setIsPlaying(true); setIsLoading(false); }}
            onPause={() => setIsPlaying(false)}
            onWaiting={() => setIsLoading(true)}
            onPlaying={() => setIsLoading(false)}
            muted={isMuted}
          />
          
          <div className="flex flex-col gap-3">
            {/* Progress Bar */}
            <div className="flex items-center gap-4 text-sm text-stone-500 font-mono" dir="ltr">
              <span className="w-12 text-right">{formatTime(progress)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={progress}
                onChange={handleSeek}
                disabled={currentJuz === null}
                className="flex-1 h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <span className="w-12">{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-4 w-1/3">
                {currentJuz !== null && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                      <BookOpen size={24} />
                    </div>
                    <div className="hidden sm:block">
                      <div className="font-bold text-stone-800 text-lg">الجزء {currentJuz + 1}</div>
                      <div className="text-sm text-stone-500">
                        {isLoading ? 'جاري التحميل...' : (isPlaying ? 'جاري التشغيل' : 'متوقف')}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 w-1/3">
                <button
                  onClick={handlePlayPause}
                  disabled={currentJuz === null}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    currentJuz === null 
                      ? 'bg-stone-100 text-stone-400 cursor-not-allowed' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105 shadow-lg shadow-emerald-200'
                  }`}
                >
                  {isPlaying ? (
                    <Pause size={32} fill="currentColor" />
                  ) : (
                    <Play size={32} className="ml-1" fill="currentColor" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 w-1/3 text-stone-500">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 hover:bg-stone-100 rounded-full hover:text-emerald-600 transition-colors"
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
