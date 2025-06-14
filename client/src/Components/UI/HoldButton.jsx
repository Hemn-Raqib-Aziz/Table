import { motion } from 'framer-motion';
import { useHoldToConfirm } from '../../hooks/useHoldToConfirm';

export default function HoldButton({
  onConfirm,
  children,
  icon: Icon,
  className = '',
  progressBarColor = 'bg-red-800',
  baseColor = 'bg-red-600',
  hoverColor = 'hover:bg-red-700',
  holdDuration = 2500,
  completedText = 'Processing...',
  progressText = (progress) => `${Math.round(progress)}%`,
  defaultText = 'Hold to Confirm',
  disabled = false,
  ...props
}) {
  const {
    holdProgress,
    isHolding,
    isCompleted,
    handleStart,
    handleEnd,
    reset
  } = useHoldToConfirm(onConfirm, holdDuration);

  const getButtonText = () => {
    if (isCompleted) return completedText;
    if (holdProgress > 0) return progressText(holdProgress);
    return defaultText;
  };

  return (
    <motion.button
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      className={`relative overflow-hidden transition-colors font-medium flex items-center justify-center space-x-2 ${baseColor} ${hoverColor} text-white ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || isCompleted}
      {...props}
    >
      {/* Progress Bar Background */}
      <motion.div
        className={`absolute inset-0 ${progressBarColor} origin-left`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: holdProgress / 100 }}
        transition={{ duration: 0.1 }}
      />
      
      {/* Button Content */}
      <div className="relative z-10 flex items-center space-x-2">
        {Icon && (
          <motion.div
            animate={isHolding ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 3, ease: "linear", repeat: isHolding ? Infinity : 0 }}
          >
            <Icon className="w-4 h-4" />
          </motion.div>
        )}
        <span>{getButtonText()}</span>
      </div>
    </motion.button>
  );
}