import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 1. Import images directly
import event1Img from '../images/1.jpg';
import event2Img from '../images/2.jpg';
import event3Img from '../images/3.jpg';
import event4Img from '../images/4.webp';
import event5Img from '../images/5.jpg';
import event6Img from '../images/6.jpg';
import event7Img from '../images/7.jpg';

const eventCards = [
  {
    title: 'Shark Tank: The Pitch Battle',
    description: 'Pitch your visionary ideas to industry titans and secure the mentorship to make them a reality.',
    icon: '🦈',
    participants: 150,
    prize: 'Seed Funding & Mentorship',
    image: event1Img,
  },
  {
    title: 'Digital Arena: Gaming Showdown',
    description: 'Compete in high-stakes tournaments across popular esports titles. Prove your skills and claim victory.',
    icon: '🎮',
    participants: 200,
    prize: '₹50,000 Prize Pool',
    image: event2Img,
  },
  {
    title: 'Code Clash',
    description: 'A classic competitive programming battle. Solve complex algorithmic problems against the clock.',
    icon: '💻',
    participants: 250,
    prize: '₹30,000 & Internships',
    image: event3Img,
  },
  {
    title: 'Design Duel',
    description: 'Showcase your graphic design prowess in a fast-paced creative challenge.',
    icon: '🎨',
    participants: 100,
    prize: '₹20,000 & Wacom Tablet',
    image: event4Img,
  },
  {
    title: 'Data Detectives',
    description: 'Analyze complex datasets to uncover hidden insights and present your findings.',
    icon: '🔍',
    participants: 120,
    prize: '₹25,000 & Analytics Course',
    image: event5Img,
  },
  {
    title: 'Story Weavers',
    description: 'Craft compelling narratives in our creative writing and storytelling competition.',
    icon: '✍️',
    participants: 80,
    prize: 'Kindle & Publishing Opportunity',
    image: event6Img,
  },
  {
    title: 'Hunt Safari',
    description: 'Embark on a campus-wide digital treasure hunt that will test your wits and teamwork.',
    icon: '🗺️',
    participants: 300,
    prize: '₹15,000 & Goodies',
    image: event7Img,
  },
];

const Events = () => {
  const [activeIndex, setActiveIndex] = useState(Math.floor(eventCards.length / 2));
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % eventCards.length);
      }, 3000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isHovered]);

  const activeEvent = eventCards[activeIndex];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 15, delay: 0.4 }
    },
  };

 return (
  <section
    id="events"
    className="relative bg-deep-dark text-gray-300 font-body overflow-hidden py-20 md:py-24"
  >
    {/* Background Effects */}
    <div className="absolute inset-0 opacity-[0.05]" style={{
      backgroundImage: `
        linear-gradient(to right, #ff1a1a 1px, transparent 1px),
        linear-gradient(to bottom, #ff1a1a 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    }}></div>
    <motion.div
      className="absolute top-1/4 -right-32 w-96 h-96 bg-cyan-400/15 rounded-full blur-[120px]"
      animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.8 }} variants={itemVariants}>
      <div className="relative inline-block">
        <motion.div
          className="absolute -top-4 left-1/4 -translate-x-1/2 w-2/4 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.3 }}
        ></motion.div>
        <h2 className="font-display font-bold text-4xl md:text-5xl uppercase text-white mb-4 relative">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore The 
          </motion.span>{' '}
          <motion.span 
            className="text-bright-red"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
             Events
          </motion.span>
        </h2>
        <motion.div
          className="absolute -bottom-4 left-1/4 -translate-x-1/2 w-2/4 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.5 }}
        ></motion.div>
      </div>
    </motion.div>

    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
        
        {/* Left Column: Event Details */}
        <motion.div 
          className="relative z-10 text-center lg:text-left"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={itemVariants}>
            <AnimatePresence mode="wait">
              <motion.h2
                key={`title-${activeIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="font-display text-4xl md:text-5xl font-bold uppercase text-white mb-4"
              >
                {activeEvent.title.split(':').map((part, index) => (
                  <span key={index} className={index === 0 ? 'text-cyan-400' : 'text-white'}>
                    {part}{index === 0 && activeEvent.title.includes(':') ? ':' : ''}
                  </span>
                ))}
              </motion.h2>
            </AnimatePresence>
          </motion.div>
          <motion.div variants={itemVariants} className="w-24 h-1 bg-bright-red mx-auto lg:mx-0 mb-8" />
          <motion.div variants={itemVariants}>
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${activeIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-300 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10"
              >
                {activeEvent.description}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 text-center lg:text-left mb-10"
          >
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-cyan-400 text-2xl">👥</span>
              <div>
                <div className="font-bold text-white">{activeEvent.participants}+</div>
                <div className="text-sm text-gray-400">Participants Enrolled</div>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-bright-red text-2xl">🏆</span>
              <div>
                <div className="font-bold text-white">{activeEvent.prize}</div>
                <div className="text-sm text-gray-400">Prize & Certification</div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={buttonVariants}>
            <a
              href="#event-shop"
              className="inline-block bg-gradient-to-r from-bright-red to-red-600 text-white px-6 py-3 rounded-md font-bold text-sm uppercase tracking-wide hover:shadow-lg hover:shadow-red-500/50 transition-all hover:scale-105"
            >
              GET YOUR TICKET NOW!!
            </a>
          </motion.div>
        </motion.div>

        {/* Right Column: Vertical Carousel */}
        <div 
          className="relative w-full h-[600px] flex items-center justify-center overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)]"
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}
        >
            {eventCards.map((card, index) => {
              const total = eventCards.length;
              const rawOffset = index - activeIndex;
              const offset = (rawOffset + Math.floor(total / 2) + total) % total - Math.floor(total / 2);
              const isCenter = offset === 0;

              return ( 
                <motion.div
                  key={card.title + index}
                    className="absolute w-[85%] max-w-[800px] h-[400px] cursor-pointer rounded-lg overflow-hidden"
                  initial={false}
                  animate={{
                    y: `${offset * 90}px`,
                    scale: isCenter ? 1.1 : 0.8,
                    rotateX: offset * -10,
                    zIndex: total - Math.abs(offset),
                    opacity: isCenter ? 1 : 0.4,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className={`relative w-full h-full transition-all duration-300 group ${isCenter ? 'shadow-neon-cyan' : ''}`}>
                    <div className={`absolute inset-0 border-2 rounded-lg transition-colors ${isCenter ? 'border-cyan-400/80' : 'border-slate-800'}`}></div>
                    <div className={`absolute inset-1 border rounded-lg transition-colors ${isCenter ? 'border-cyan-400/30' : 'border-transparent'}`}></div>

                    <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <h4 className="absolute bottom-4 left-4 font-display text-lg text-white font-bold" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.8)' }}>
                      {card.title.split(':')[0]}
                    </h4>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  </section>
  );
};

export default Events;