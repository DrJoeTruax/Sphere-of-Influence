'use client'

import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({
  size = 'md',
  message,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }

  const spinnerSize = sizeClasses[size]

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className={`${spinnerSize} border-4 border-gray-700 border-t-blue-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-400 text-center"
        >
          {message}
        </motion.p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        {content}
      </div>
    )
  }

  return content
}
