'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  city: string;
  temp_min: number;
  temp_max: number;
}

export default function WeatherDisplay() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      // API 키를 직접 URL에 포함
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Seoul&units=metric&appid=2da4a971112084898f45c560c43651f1`
      );
      
      if (!response.ok) {
        throw new Error('날씨 정보를 가져오는데 실패했습니다');
      }
      
      const data = await response.json();
      
      setWeather({
        temp: data.main.temp,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        city: data.name,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max
      });
      
      setError(null);
    } catch (err) {
      setError('날씨 정보를 가져오는데 문제가 발생했습니다');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    
    // 10분마다 날씨 정보 업데이트
    const intervalId = setInterval(fetchWeather, 10 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading && !weather) {
    return (
      <motion.div 
        className="flex flex-col items-center p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full mb-4"
        />
        <p className="text-white/70">날씨 정보를 불러오는 중...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="flex flex-col items-center p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-red-400 mb-4">{error}</p>
        <motion.button 
          onClick={fetchWeather}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          다시 시도
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex flex-col p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg w-full h-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ boxShadow: "0 0 20px rgba(0, 0, 255, 0.3)" }}
    >
      <motion.h2 
        className="text-lg font-semibold text-white/80 mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        서울 날씨
      </motion.h2>
      
      {weather && (
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <motion.div 
              className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 mr-3 flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
            >
              <motion.span
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                ☀️
              </motion.span>
            </motion.div>
            <div className="flex flex-col">
              <motion.div 
                className="text-3xl font-bold text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {Math.round(weather.temp)}°C
              </motion.div>
              <motion.div 
                className="text-blue-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                {weather.description}
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className="text-sm text-white/60 mt-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            체감온도: {Math.round(weather.temp)}°C
          </motion.div>
          <motion.div 
            className="text-sm text-white/60"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            최저/최고: {Math.round(weather.temp_min)}°C / {Math.round(weather.temp_max)}°C
          </motion.div>
        </div>
      )}
    </motion.div>
  );
} 