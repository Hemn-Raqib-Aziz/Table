import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowUturnLeftIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function UndoToast({ 
  isOpen, 
  onUndo, 
  onClose, 
  userName, 
  duration = 7000,
  type = 'delete' // 'delete' or 'update'
}) {
  const [timeLeft, setTimeLeft] = useState(duration / 1000);
  const [progress, setProgress] = useState(100);

  // Configuration based on type
  const config = {
    delete: {
      title: 'Deleting User',
      description: 'will be permanently deleted',
      icon: TrashIcon,
      iconBgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      progressColor: 'from-red-500 to-red-600',
      timerColor: 'text-red-600',
      buttonColor: 'bg-red-600',
      buttonHoverColor: 'hover:bg-red-700',
      undoText: 'Undo Delete'
    },
    update: {
      title: 'Updating User',
      description: 'will be updated with new information',
      icon: PencilIcon,
      iconBgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      progressColor: 'from-indigo-500 to-indigo-600',
      timerColor: 'text-indigo-600',
      buttonColor: 'bg-indigo-600',
      buttonHoverColor: 'hover:bg-indigo-700',
      undoText: 'Undo Update'
    }
  };

  const currentConfig = config[type] || config.delete;
  const IconComponent = currentConfig.icon;

  useEffect(() => {
    if (!isOpen) return;

    setTimeLeft((duration - 2) / 1000);
    setProgress(100);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 0.1;
        if (newTime <= 0) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return newTime;
      });

      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 100));
        return newProgress > 0 ? newProgress : 0;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, duration, onClose]);

  const handleUndo = () => {
    onUndo();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="fixed top-4 sm:top-6 left-4 z-50 max-w-sm"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Progress bar at top */}
              <div className="h-1 bg-gray-100 relative overflow-hidden">
                <motion.div
                  className={`absolute left-0 top-0 h-full bg-gradient-to-r ${currentConfig.progressColor}`}
                  initial={{ width: "100%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>

              <div className="p-4 sm:p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    {/* Animated icon */}
                    <motion.div 
                      className={`flex-shrink-0 w-10 h-10 ${currentConfig.iconBgColor} rounded-xl flex items-center justify-center`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        ease: "easeOut",
                        delay: 0.1
                      }}
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <IconComponent className={`w-5 h-5 ${currentConfig.iconColor}`} />
                      </motion.div>
                    </motion.div>
                    
                    <div className="flex-1 min-w-0">
                      <motion.h3 
                        className="text-sm font-semibold text-gray-900 mb-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {currentConfig.title}
                      </motion.h3>
                      <motion.p 
                        className="text-xs text-gray-600 break-words"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <span className="font-medium">{userName}</span> {currentConfig.description}
                      </motion.p>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={onClose}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 -m-1"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Timer and warning */}
                <motion.div 
                  className="mb-4 p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Time remaining:</span>
                    <motion.span 
                      className={`font-mono font-semibold ${currentConfig.timerColor}`}
                      animate={{ 
                        scale: timeLeft <= 1 ? [1, 1.1, 1] : 1,
                        color: timeLeft <= 1 ? 
                          (type === 'delete' ? ['#dc2626', '#ef4444', '#dc2626'] : ['#4f46e5', '#6366f1', '#4f46e5']) 
                          : (type === 'delete' ? '#dc2626' : '#4f46e5')
                      }}
                      transition={{ 
                        duration: 0.5,
                        repeat: timeLeft <= 1 ? Infinity : 0
                      }}
                    >
                      {Math.ceil(timeLeft)}s
                    </motion.span>
                  </div>
                </motion.div>

                {/* Action buttons */}
                <motion.div 
                  className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Dismiss
                  </button>
                  
                  <motion.button
                    onClick={handleUndo}
                    className={`flex-1 sm:flex-none px-4 py-2.5 ${currentConfig.buttonColor} ${currentConfig.buttonHoverColor} text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                      boxShadow: timeLeft <= 2 ? [
                        type === 'delete' ? '0 1px 3px rgba(220, 38, 38, 0.1)' : '0 1px 3px rgba(79, 70, 229, 0.1)',
                        type === 'delete' ? '0 4px 12px rgba(220, 38, 38, 0.3)' : '0 4px 12px rgba(79, 70, 229, 0.3)',
                        type === 'delete' ? '0 1px 3px rgba(220, 38, 38, 0.1)' : '0 1px 3px rgba(79, 70, 229, 0.1)'
                      ] : (type === 'delete' ? '0 1px 3px rgba(220, 38, 38, 0.1)' : '0 1px 3px rgba(79, 70, 229, 0.1)')
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: timeLeft <= 2 ? Infinity : 0
                    }}
                  >
                    <ArrowUturnLeftIcon className="w-4 h-4" />
                    <span>{currentConfig.undoText}</span>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}