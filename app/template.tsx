'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 20, 
        duration: 0.3 
      }}
      className="flex flex-col flex-1"
    >
      {children}
    </motion.div>
  );
}
