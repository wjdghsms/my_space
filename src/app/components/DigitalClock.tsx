'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DigitalClockProps {
  initialFormat?: '12h' | '24h';
}

export default function DigitalClock({ initialFormat = '24h' }: DigitalClockProps) {
  const [time, setTime] = useState<string>('--:--:--');
  const [format, setFormat] = useState<'12h' | '24h'>(initialFormat);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      
      let timeString = '';
      
      if (format === '12h') {
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
        timeString = `${hours}:${minutes}:${seconds} ${period}`;
      } else {
        timeString = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
      }
      
      setTime(timeString);
    };

    // Update time immediately
    updateTime();
    
    // Update time every second
    const intervalId = setInterval(updateTime, 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [format]);

  // 시간 부분을 분리하여 각각 애니메이션 적용
  const timeArray = time.split('');

  return (
    <motion.div 
      className="flex items-center justify-center p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg w-full h-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ boxShadow: "0 0 20px rgba(0, 0, 255, 0.3)" }}
    >
      <div className="flex items-center justify-center">
        {timeArray.map((char, index) => (
          <motion.span
            key={index}
            className={`text-5xl md:text-6xl font-mono font-bold ${char === ':' ? 'text-blue-400 mx-1' : 'text-white'}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.05,
              type: "spring",
              stiffness: 300,
              damping: 15
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
} 