'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface RouletteWheelProps {
  options: string[];
  isSpinning: boolean;
  onOptionClick: (option: string) => void;
  selectedOption: string | null;
  isContinuousSpin: boolean;
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({ options, isSpinning, onOptionClick, selectedOption, isContinuousSpin }) => {
  const [rotation, setRotation] = useState(0);
  const segmentAngle = 360 / options.length;

  useEffect(() => {
    if (isContinuousSpin) {
      setRotation(prevRotation => prevRotation + 360 * 100);
    } else if (isSpinning && selectedOption) {
      const selectedIndex = options.indexOf(selectedOption);
      if (selectedIndex === -1) return;

      setRotation(prevRotation => {
        const segmentCenterAngle = (selectedIndex * segmentAngle + segmentAngle / 2);
        let desiredStopAngle = 360 - (segmentCenterAngle % 360);
        desiredStopAngle = (desiredStopAngle % 360 + 360) % 360;

        const numFullSpins = 1;
        const baseRotation = numFullSpins * 360;

        const currentEffectiveRotation = prevRotation % 360;
        let rotationToAdd = desiredStopAngle - currentEffectiveRotation;
        
        if (rotationToAdd < 0) {
          rotationToAdd += 360; 
        }
        
        const totalFinalRotation = prevRotation + baseRotation + rotationToAdd;
        return totalFinalRotation;
      });
    }
  }, [isContinuousSpin, isSpinning, selectedOption, options, segmentAngle]);

  if (options.length === 0) {
    return (
      <div className="relative w-full h-full flex items-center justify-center text-gray-500 border-4 border-gray-300 rounded-full">
        옵션을 추가해주세요.
      </div>
    );
  }

  return (
    <div className="relative w-full h-full mx-auto">
      <motion.div
        className="absolute w-full h-full rounded-full border-4 border-gray-800 flex items-center justify-center"
        animate={{ rotate: rotation }}
        transition={{
          duration: isContinuousSpin ? 5 : 8,
          ease: isContinuousSpin ? "linear" : [0.0, 1.0, 0.5, 1.0],
          repeat: isContinuousSpin ? Infinity : 0,
        }}
      >
        <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <circle cx="50" cy="50" r="50" fill="none" stroke="#fff" strokeWidth="0.5" />
          {options.map((option, index) => {
            const startAngle = index * segmentAngle - 90;
            const endAngle = (index + 1) * segmentAngle - 90;

            const x1 = 50 + 49.5 * Math.cos(startAngle * Math.PI / 180);
            const y1 = 50 + 49.5 * Math.sin(startAngle * Math.PI / 180);
            const x2 = 50 + 49.5 * Math.cos(endAngle * Math.PI / 180);
            const y2 = 50 + 49.5 * Math.sin(endAngle * Math.PI / 180);
            const largeArcFlag = segmentAngle > 180 ? 1 : 0;

            const d = `M 50 50 L ${x1} ${y1} A 49.5 49.5 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            const color = `hsl(${(360 / options.length) * index}, 60%, 85%)`;

            const textRotationAngle = startAngle + segmentAngle / 2 + 90;
            const textRadius = 30;
            const textX = 50 + textRadius * Math.cos((startAngle + segmentAngle / 2) * Math.PI / 180);
            const textY = 50 + textRadius * Math.sin((startAngle + segmentAngle / 2) * Math.PI / 180);

            return (
              <g key={index} className="cursor-pointer" onClick={() => onOptionClick(option)}>
                <path d={d} fill={color} stroke="#fff" strokeWidth="0.5" />
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  transform={`rotate(${textRotationAngle}, ${textX}, ${textY})`}
                  fill="#4B5563"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {option}
                </text>
              </g>
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
};

export default RouletteWheel; 