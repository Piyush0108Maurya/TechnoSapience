import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import robotImage from '../images/robot.jpg';
import { motion, useSpring, useTransform } from 'framer-motion';

// Animated Number Component for the Countdown
const AnimatedNumber = ({ value }) => {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) =>
    String(Math.round(current)).padStart(2, '0')
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
};

// Countdown Timer Component
const Countdown = () => {
  const calculateTimeLeft = () => {
    const difference = +new Date('2026-01-15T00:00:00') - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval] && timeLeft[interval] !== 0) {
      return null;
    }
    return (
      <div key={interval} className="text-center">
        <div className="text-3xl sm:text-4xl md:text-5xl font-condensed text-bright-red">
          <AnimatedNumber value={timeLeft[interval]} />
        </div>
        <div className="text-xs uppercase tracking-widest text-gray-400">{interval}</div>
      </div>
    );
  });

  return (
    <div className="flex justify-center gap-4">
      {timerComponents.length ? timerComponents : <span>Event has started!</span>}
    </div>
  );
};

// --- Animation Variants for Framer Motion ---

// Staggered container for the main content
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.8,
    },
  },
};

// Standard fade-in-up animation for text elements
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

// Pop-up animation for buttons
const buttonVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 15, delay: 2.5 },
  },
};

// Zoom-in animation for the central robot image
const imageVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  },
};

// Typewriter effect for the tagline
const tagline = "IITM JANAKPURI PRESENTS...";
const taglineContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.5,
    },
  },
};
const taglineCharVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const Hero = () => (
  <div className="min-h-screen bg-gray-900 font-body text-gray-300 overflow-hidden">
    <Navbar />
    <header
      className="relative min-h-screen flex flex-col items-center justify-end bg-deep-dark animate-grid-scroll"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 26, 26, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 26, 26, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    >
      <div className="absolute inset-0 bg-radial-gradient"></div>

      {/* Background Text */}
      <div className="absolute top-28 md:top-24 w-full text-center z-0">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="font-display text-[3.5rem] sm:text-[5rem] md:text-[8rem] lg:text-[8rem] font-black uppercase leading-none text-red-500/20 animate-pulse tracking-widest"
        >
          Techno<br className="block md:hidden" />Sapiens
        </motion.h1>
      </div>

      {/* Center Image */}
      
   <motion.div
  className="absolute inset-0 flex items-center justify-center z-20"
  variants={imageVariants}
  initial="hidden"
  animate="visible"
>
  <img
    src={robotImage}
    alt="TechnoSapiens AI Robot"
    className="w-[280px] sm:w-[350px] md:w-[450px] lg:w-[750px] h-auto object-contain drop-shadow-2xl"
    
    style={{ filter: 'drop-shadow(0 0 35px rgba(88, 9, 9, 0.7))' }}
  />
</motion.div>


      {/* Foreground Content */}
      <motion.div
        className="relative z-30 grid grid-cols-1 md:grid-cols-2 items-end w-full px-4 sm:px-6 md:px-8 lg:px-12 pb-6 sm:pb-8 md:pb-12 lg:pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column */}
        <div className="flex flex-col items-center md:items-start space-y-6 text-center md:text-left">
          <motion.p
            className="font-display text-sm sm:text-base md:text-lg tracking-widest text-red-500"
            variants={taglineContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {tagline.split("").map((char, index) => (
              <motion.span key={index} variants={taglineCharVariants}>
                {char}
              </motion.span>
            ))}
          </motion.p>
          <motion.p variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 2.2 } } }} className="text-xs sm:text-sm md:text-base max-w-sm leading-relaxed">
            Discover the future of innovation where creativity meets technology.
            <br/>
            <span className="text-bright-red text-shadow-red-medium font-bold">Code, Create, Conquer.</span>
            <br/> Join the definitive tech summit for IITM's brightest minds.
          </motion.p>
          <motion.div variants={buttonVariants} className="hidden md:block">
            <a
              href="#events"
              className="inline-block px-8 py-2 sm:px-10 sm:py-3 text-sm sm:text-md font-bold uppercase tracking-wider 
                              font-condensed text-cyan-400 bg-transparent border-2 border-cyan-400 rounded-full shadow-lg transition-all duration-300
                              hover:bg-cyan-400/10 hover:shadow-neon-cyan hover:scale-105"
            >
              View Events
            </a>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-center md:items-end space-y-4 sm:space-y-6 mt-8 md:mt-0">
          <motion.div variants={itemVariants} className="text-center md:text-right">
            <h3 className="font-condensed text-base sm:text-lg font-semibold uppercase text-gray-200 mb-2">Event Date</h3>
            <p className="font-condensed text-xl sm:text-2xl text-bright-red">JAN 15, 2026</p>
          </motion.div>
          {/* Group for Countdown and Register Button */}
          <div className="flex flex-col items-center space-y-8">
            <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 1.5 } } }} className="w-full max-w-sm hidden md:block">
              <Countdown />
            </motion.div>
            <motion.div variants={buttonVariants} className="block md:hidden">
              <a
                href="#events"
                className="inline-block px-8 py-2 sm:px-10 sm:py-3 text-sm sm:text-md font-bold uppercase tracking-wider 
                              font-condensed text-cyan-400 bg-transparent border-2 border-cyan-400 rounded-full shadow-lg transition-all duration-300
                              hover:bg-cyan-400/10 hover:shadow-neon-cyan hover:scale-105"
              >
                View Events
              </a>
            </motion.div>
            <motion.div variants={buttonVariants}>
              <a
                href="#register"
                className="inline-block px-10 py-3 sm:px-12 sm:py-4 text-base sm:text-lg font-bold uppercase tracking-wider font-condensed
                                text-gray-100 bg-bright-red rounded-full shadow-lg transition-all duration-300
                                hover:bg-dark-red hover:shadow-neon-dark-red hover:scale-105 shadow-neon-red 
                                transform animate-float "
              >
                Register Now
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </header>
  </div>
);

export default Hero;