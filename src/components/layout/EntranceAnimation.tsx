import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface EntranceAnimationProps {
  onComplete: () => void;
}

export const EntranceAnimation: React.FC<EntranceAnimationProps> = ({ onComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 1500); // Allow exit animations to finish
    }, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] bg-[#050505] flex items-center justify-center overflow-hidden"
        >
          {/* Logo Central Sequence */}
          <div className="relative flex flex-col items-center">
             <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
                className="w-32 h-32 rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl mb-12 relative overflow-hidden"
             >
                <img src="/logo.png" alt="Wocon Logo" className="w-20 h-20 object-contain z-10" />
                <motion.div 
                   animate={{ 
                     rotate: 360,
                     scale: [1, 1.2, 1]
                   }}
                   transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-emerald-500/20 opacity-50"
                />
             </motion.div>

             <div className="overflow-hidden">
                <motion.h1 
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.5, duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                  className="text-6xl font-black text-white tracking-widest uppercase font-display italic"
                >
                  WOCON
                </motion.h1>
             </div>

             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: 200 }}
               transition={{ delay: 1, duration: 2, ease: [0.76, 0, 0.24, 1] }}
               className="h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent mt-8"
             />

             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1.8, duration: 1 }}
               className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mt-6"
             >
               Global Expedition Node • 4.1
             </motion.p>
          </div>

          {/* Background Cinematic Elements */}
          <motion.div 
             initial={{ opacity: 0, scale: 1.5 }}
             animate={{ opacity: 0.3, scale: 1 }}
             transition={{ duration: 4, ease: "easeOut" }}
             className="absolute inset-0 pointer-events-none"
          >
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1e3a8a33,transparent_70%)]" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-pulse" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-white/5 rounded-full opacity-20" />
          </motion.div>

          {/* Split Screen Exit Reveal */}
          <motion.div 
            initial={{ height: "0%" }}
            exit={{ height: "100%" }}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
            className="absolute top-0 left-0 right-0 bg-[#050505] z-[210] origin-top"
          />
          <motion.div 
            initial={{ height: "0%" }}
            exit={{ height: "100%" }}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
            className="absolute bottom-0 left-0 right-0 bg-[#050505] z-[210] origin-bottom"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
