'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ResultModalProps {
  result: string | null;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (result) {
      // Play clap BGM
      audioRef.current?.play();

      // Fire confetti
      const duration = 10 * 1000; // 10 seconds
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);

    } else {
      // Stop and reset audio when modal is closed
      audioRef.current?.pause();
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  }, [result]);

  if (!result) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 p-8 rounded-2xl shadow-2xl text-center max-w-[90%] w-[400px] backdrop-blur-sm border border-indigo-100">
        <div className="mb-6">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            축하합니다!
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
        </div>
        <p className="text-2xl mb-8">
          최종결과: <span className="font-bold text-indigo-600">{result}</span>
        </p>
        <button
          onClick={onClose}
          className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full hover:from-gray-600 hover:to-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
        >
          닫기
        </button>
      </div>
      <audio ref={audioRef} src="/Clap BGM.mp3" preload="auto" />
    </div>
  );
};

export default ResultModal; 