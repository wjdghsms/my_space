'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type FilterType = '전체' | '미완료' | '완료';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterType>('전체');

  // 로컬 스토리지에서 할 일 목록 불러오기
  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.error('Failed to parse todos from localStorage:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // 할 일 목록이 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    // 초기화 후에만 localStorage에 저장
    if (isInitialized) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isInitialized]);

  // 새 할 일 추가
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newTodo.trim() === '') return;
    
    const newTodoItem: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false
    };
    
    setTodos(prevTodos => [...prevTodos, newTodoItem]);
    setNewTodo('');
  };

  // 할 일 완료 상태 토글
  const toggleTodo = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 할 일 삭제
  const deleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  // 필터링된 할 일 목록
  const filteredTodos = todos.filter(todo => {
    if (filter === '전체') return true;
    if (filter === '미완료') return !todo.completed;
    if (filter === '완료') return todo.completed;
    return true;
  });

  // 애니메이션 변수
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: { 
      opacity: 0, 
      x: -100,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="flex flex-col p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ boxShadow: "0 0 20px rgba(0, 0, 255, 0.3)" }}
    >
      <motion.h2 
        className="text-lg font-semibold text-white/80 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        할 일 목록
      </motion.h2>
      
      <motion.form 
        onSubmit={addTodo} 
        className="mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="새로운 할 일 입력하세요"
          className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
        />
        <motion.button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          추가
        </motion.button>
      </motion.form>
      
      <motion.div 
        className="flex mb-4 space-x-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {(['전체', '미완료', '완료'] as FilterType[]).map((filterType) => (
          <motion.button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === filterType 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700/70 text-gray-300 hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {filterType}
          </motion.button>
        ))}
      </motion.div>
      
      {!isInitialized ? (
        <motion.div 
          className="flex justify-center items-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"
          />
          <p className="ml-3 text-white/70">로딩 중...</p>
        </motion.div>
      ) : (
        <motion.ul 
          className="space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {filteredTodos.length === 0 ? (
              <motion.li 
                key="empty"
                className="text-white/60 text-center py-6 bg-gray-700/30 rounded-lg"
                variants={itemVariants}
              >
                할 일이 없습니다
              </motion.li>
            ) : (
              filteredTodos.map(todo => (
                <motion.li 
                  key={todo.id}
                  className="flex items-center justify-between p-3 bg-gray-700/30 border border-gray-700 rounded-lg"
                  variants={itemVariants}
                  layout
                  exit="exit"
                  whileHover={{ scale: 1.01, backgroundColor: 'rgba(75, 85, 99, 0.4)' }}
                >
                  <div className="flex items-center">
                    <motion.input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="mr-3 h-5 w-5 text-blue-500 rounded bg-gray-700 border-gray-500 focus:ring-blue-500"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                    <motion.span 
                      className={`text-white ${todo.completed ? 'line-through text-white/50' : ''}`}
                      animate={{ 
                        color: todo.completed ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.9)'
                      }}
                    >
                      {todo.text}
                    </motion.span>
                  </div>
                  <motion.button
                    onClick={() => deleteTodo(todo.id)}
                    className="ml-2 text-red-400 hover:text-red-300"
                    aria-label="Delete todo"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </motion.li>
              ))
            )}
          </AnimatePresence>
        </motion.ul>
      )}
    </motion.div>
  );
} 