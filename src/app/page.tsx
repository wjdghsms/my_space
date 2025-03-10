'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { motion } from 'framer-motion';

// 클라이언트 사이드에서만 렌더링되도록 dynamic import 사용
const DigitalClock = dynamic(() => import('./components/DigitalClock'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg w-full">
      <div className="text-4xl font-mono font-bold text-white/80">--:--:--</div>
    </div>
  )
});

const WeatherDisplay = dynamic(() => import('./components/WeatherDisplay'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg w-full">
      <h2 className="text-xl font-semibold mb-4 text-white/80">서울 날씨</h2>
      <p className="text-white/60">날씨 정보를 불러오는 중...</p>
    </div>
  )
});

const TodoList = dynamic(() => import('./components/TodoList'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg w-full">
      <h2 className="text-xl font-semibold mb-4 text-white/80">할 일 목록</h2>
      <p className="text-white/60">로딩 중...</p>
    </div>
  )
});

// 애니메이션 변수
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      duration: 0.5
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 15
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
      
      <motion.div 
        className="max-w-4xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="grid grid-cols-2 gap-4 mb-4"
          variants={containerVariants}
        >
          <motion.div 
            className="col-span-1"
            variants={itemVariants}
          >
            <Suspense fallback={<div>로딩 중...</div>}>
              <DigitalClock initialFormat="24h" />
            </Suspense>
          </motion.div>
          
          <motion.div 
            className="col-span-1"
            variants={itemVariants}
          >
            <Suspense fallback={<div>로딩 중...</div>}>
              <WeatherDisplay />
            </Suspense>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="w-full"
          variants={itemVariants}
        >
          <Suspense fallback={<div>로딩 중...</div>}>
            <TodoList />
          </Suspense>
        </motion.div>
      </motion.div>
    </div>
  );
}
