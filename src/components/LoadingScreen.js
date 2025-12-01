import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../images/logo.png';

const LoadingScreen = ({ isLoading }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('initializing');

  const loadingPhases = [
    { name: 'Initializing Systems', duration: 800 },
    { name: 'Connecting to Neural Network', duration: 1200 },
    { name: 'Loading Techno Core', duration: 1000 },
    { name: 'Calibrating Sapiens AI', duration: 900 },
    { name: 'System Ready', duration: 400 }
  ];

  useEffect(() => {
    if (!isLoading) return;

    let currentPhaseIndex = 0;
    let phaseStartTime = Date.now();
    let totalDuration = loadingPhases.reduce((acc, phase) => acc + phase.duration, 0);
    let elapsedTime = 0;

    const interval = setInterval(() => {
      elapsedTime = Date.now() - phaseStartTime;
      
      // Calculate progress based on current phase
      let totalProgress = 0;
      for (let i = 0; i < currentPhaseIndex; i++) {
        totalProgress += (loadingPhases[i].duration / totalDuration) * 100;
      }
      
      if (currentPhaseIndex < loadingPhases.length) {
        const currentPhaseProgress = Math.min((elapsedTime / loadingPhases[currentPhaseIndex].duration) * 100, 100);
        totalProgress += (currentPhaseProgress / 100) * (loadingPhases[currentPhaseIndex].duration / totalDuration) * 100;
        setLoadingProgress(Math.min(totalProgress, 100));
      }

      // Move to next phase
      if (elapsedTime >= loadingPhases[currentPhaseIndex]?.duration) {
        if (currentPhaseIndex < loadingPhases.length - 1) {
          currentPhaseIndex++;
          phaseStartTime = Date.now();
          setCurrentPhase(loadingPhases[currentPhaseIndex].name);
        } else {
          setLoadingProgress(100);
          clearInterval(interval);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Reset when loading starts
  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(0);
      setCurrentPhase(loadingPhases[0].name);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          className="fixed inset-0 z-50 bg-deep-dark overflow-hidden"
        >
          {/* Animated Grid Background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 26, 26, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 26, 26, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              animation: 'grid-scroll 2s linear infinite',
            }}
          />
          
          {/* Radial Gradient Overlay */}
          <div className="absolute inset-0 bg-radial-gradient" />
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-bright-red rounded-full"
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: window.innerHeight + 20,
                  opacity: Math.random() * 0.5 + 0.5
                }}
                animate={{ 
                  y: -20,
                  x: Math.random() * window.innerWidth,
                  opacity: 0
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear"
                }}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
            {/* Logo Container */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: [0, 1.2, 1], 
                rotate: [-180, 0],
              }}
              transition={{
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mb-12"
            >
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 animate-glow-pulse">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-bright-red/20 rounded-full blur-2xl" />
                </div>
                
                {/* Logo */}
                <motion.img
                  src={logo}
                  alt="TechnoSapiens"
                  className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain rounded-full"
                  style={{
                    clipPath: 'circle(50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: '8px'
                  }}
                  animate={{ 
                    filter: [
                      'drop-shadow(0 0 25px rgba(255, 26, 26, 0.5))',
                      'drop-shadow(0 0 40px rgba(255, 26, 26, 0.8))',
                      'drop-shadow(0 0 25px rgba(255, 26, 26, 0.5))'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-gradient-to-r from-bright-red via-cyan-400 to-bright-red bg-clip-text mb-2 tracking-wider"
            >
              TECHNOSAPIENS
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="font-condensed text-sm sm:text-base text-cyan-400 mb-12 tracking-widest uppercase"
            >
              IITM JANAKPURI PRESENTS
            </motion.p>

            {/* Loading Progress Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="w-full max-w-md space-y-6"
            >
              {/* Current Phase Text */}
              <div className="text-center">
                <motion.p
                  key={currentPhase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-body text-gray-300 text-sm sm:text-base"
                >
                  {currentPhase}
                </motion.p>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                {/* Background */}
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  {/* Progress Fill */}
                  <motion.div
                    className="h-full bg-gradient-to-r from-bright-red to-cyan-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
                
                {/* Glow Effect */}
                <div 
                  className="absolute top-0 left-0 h-full w-2 bg-cyan-400 rounded-full blur-sm"
                  style={{
                    left: `${loadingProgress}%`,
                    transform: 'translateX(-50%)',
                    boxShadow: '0 0 10px #22d3ee, 0 0 20px #22d3ee'
                  }}
                />
              </div>

              {/* Progress Percentage */}
              <div className="text-center">
                <motion.span
                  key={loadingProgress}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="font-condensed text-2xl sm:text-3xl text-bright-red font-bold"
                >
                  {Math.round(loadingProgress)}%
                </motion.span>
              </div>

              {/* Loading Dots */}
              <div className="flex justify-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Bottom Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="absolute bottom-8 text-center"
            >
              <p className="font-condensed text-xs text-gray-500 tracking-widest uppercase">
                Code • Create • Conquer
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
