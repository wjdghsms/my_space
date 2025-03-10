'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [filter, setFilter] = useState<FilterType>('전체');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 서버에서 할 일 목록 불러오기
  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/todos');
      
      if (!response.ok) {
        throw new Error('할 일 목록을 불러오는데 실패했습니다');
      }
      
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('할 일 목록을 불러오는데 문제가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 서버에 할 일 목록 저장하기
  const saveTodos = async (updatedTodos: Todo[]) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodos),
      });
      
      if (!response.ok) {
        throw new Error('할 일 목록을 저장하는데 실패했습니다');
      }
      setError(null);
    } catch (err) {
      console.error('Error saving todos:', err);
      setError('할 일 목록을 저장하는데 문제가 발생했습니다');
    }
  };

  // 컴포넌트 마운트 시 할 일 목록 불러오기
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // 할 일 목록이 변경될 때마다 서버에 저장
  useEffect(() => {
    if (!isLoading) {
      saveTodos(todos);
    }
  }, [todos, isLoading]);

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

  // 할 일 목록 새로고침
  const refreshTodos = () => {
    fetchTodos();
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
      <div className="flex justify-between items-center mb-4">
        <motion.h2 
          className="text-lg font-semibold text-white/80"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          할 일 목록
        </motion.h2>
        <motion.button
          onClick={refreshTodos}
          className="p-2 text-blue-400 hover:text-blue-300 rounded-full"
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.5 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </motion.button>
      </div>

      {error && (
        <motion.div 
          className="mb-4 p-3 bg-red-500/30 text-red-200 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}
      
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
      
      {isLoading ? (
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