'use client';

import { useState, useRef, useEffect } from 'react';
import RouletteWheel from './components/RouletteWheel';
import ResultModal from './components/ResultModal';

export default function Home() {
  const [options, setOptions] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [targetOptionForSpin, setTargetOptionForSpin] = useState<string | null>(null);
  const [newOptionText, setNewOptionText] = useState('');
  const [isSpinButtonHeld, setIsSpinButtonHeld] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isSpinning) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  }, [isSpinning]);

  const handleSpin = () => {
    if (options.length === 0) return;

    setIsSpinning(true);
    setIsSpinButtonHeld(true);
    setResult(null);
    setTargetOptionForSpin(null);
  };

  const handleStopSpin = () => {
    if (!isSpinButtonHeld) return;

    setIsSpinButtonHeld(false);
    
    const randomIndex = Math.floor(Math.random() * options.length);
    const finalSelectedOption = options[randomIndex];
    setTargetOptionForSpin(finalSelectedOption);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(finalSelectedOption);
      setTargetOptionForSpin(null);
    }, 6000);
  };

  const handleDeleteOption = (optionToDelete: string) => {
    if (window.confirm(`${optionToDelete}을(를) 삭제하시겠습니까?`)) {
      setOptions(prevOptions => prevOptions.filter(option => option !== optionToDelete));
      if (result === optionToDelete) setResult(null);
      if (targetOptionForSpin === optionToDelete) setTargetOptionForSpin(null);
    }
  };

  const handleAddOption = () => {
    if (newOptionText.trim() === '') return;

    if (options.includes(newOptionText.trim())) {
      alert('이미 존재하는 옵션입니다. 다른 옵션을 입력해주세요.');
      setNewOptionText('');
      return;
    }

    setOptions(prevOptions => [...prevOptions, newOptionText.trim()]);
    setNewOptionText('');
  };

  return (
    <main className="h-[100dvh] flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4 overflow-hidden">
      <div className="flex flex-col items-center gap-12">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          돌려돌려~ 돌림판
        </h1>
        <div className="relative w-full max-w-[280px] aspect-square">
          <div className="absolute inset-0 bg-white/30 rounded-full blur-xl"></div>
          <RouletteWheel 
            options={options} 
            isSpinning={isSpinning} 
            onOptionClick={handleDeleteOption}
            selectedOption={targetOptionForSpin}
            isContinuousSpin={isSpinButtonHeld}
          />
          <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-500"></div>
          </div>
        </div>
        <button
          onMouseDown={handleSpin}
          onMouseUp={handleStopSpin}
          onMouseLeave={handleStopSpin}
          onTouchStart={handleSpin}
          onTouchEnd={handleStopSpin}
          onTouchCancel={handleStopSpin}
          disabled={isSpinning && !isSpinButtonHeld || options.length === 0}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isSpinButtonHeld ? '돌리는 중...' : isSpinning ? '멈추는 중...' : '돌아라!!'}
        </button>

        <audio ref={audioRef} src="/방구차 BGM.mp3" loop preload="auto" />

        <div className="flex items-center gap-2 w-full max-w-[280px]">
          <input
            type="text"
            value={newOptionText}
            onChange={(e) => setNewOptionText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newOptionText.trim() !== '') {
                handleAddOption();
              }
            }}
            placeholder="새 옵션 추가" 
            className="px-4 py-2 border-2 border-indigo-200 rounded-full flex-1 text-sm focus:outline-none focus:border-indigo-500 transition-colors duration-300 bg-white/80 backdrop-blur-sm"
          />
          <button
            onClick={handleAddOption}
            className="px-5 h-[38px] bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 whitespace-nowrap text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
            disabled={newOptionText.trim() === ''}
          >
            추가
          </button>
        </div>
      </div>

      {result && !isSpinning && (
        <ResultModal result={result} onClose={() => setResult(null)} />
      )}
    </main>
  );
}
