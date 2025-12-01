import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Placeholder sponsor data
const sponsorsList = [
  { name: 'GitHub', logo: '🐙', href: '#' },
  { name: 'Vercel', logo: '⚡', href: '#' },
  { name: 'Figma', logo: '🎨', href: '#' },
  { name: 'Framer', logo: '🎬', href: '#' },
  { name: 'Notion', logo: '📝', href: '#' },
  { name: 'Next.js', logo: '▲', href: '#' },
  { name: 'Meta', logo: 'f', href: '#' },
  { name: 'Google', logo: 'G', href: '#' },
];

const SponsorCard = ({ sponsor, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      <motion.div
        className="relative w-60 md:w-72 h-28 flex flex-row items-center justify-center overflow-hidden"
        animate={isHovered ? {
          y: -10,
          boxShadow: '0 30px 60px rgba(239, 68, 68, 0.2), 0 0 40px rgba(0, 255, 255, 0.15)'
        } : {
          y: 0,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-gray-900/30 to-cyan-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl" />

        {/* Animated gradient border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
          style={{
            background: 'conic-gradient(from 0deg, #ff1a1a, #00ffff, #ff1a1a)',
            padding: '2px',
            borderRadius: '16px'
          }}
          animate={isHovered ? {
            rotate: 360,
            opacity: 0.3
          } : {
            rotate: 0, 
            opacity: 0
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* Inner glass effect */}
        <motion.div
          className="absolute inset-0.5 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none"
          animate={isHovered ? { opacity: 0.8 } : { opacity: 0.3 }}
          transition={{ duration: 0.3 }}
        />

        {/* Content wrapper */}
        <div className="relative z-10 flex flex-row items-center justify-center h-full space-x-4 px-4">
          {/* Logo container with glow */}
          <motion.div
            className="relative"
            animate={isHovered ? {
              scale: 1.3,
              rotateZ: 360
            } : {
              scale: 1,
              rotateZ: 0 
            }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
          >
            {/* Logo glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-red-500 rounded-full blur-xl"
              animate={isHovered ? { 
                scale: 1.5, 
                opacity: 0.6
              } : {
                scale: 1,
                opacity: 0.3 
              }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Logo */}
            <div className="relative text-4xl md:text-5xl filter drop-shadow-lg">
              {sponsor.logo}
            </div>
          </motion.div>

          {/* Sponsor name with blur effect */}
          <div className="relative overflow-hidden">
            <motion.h3
              className="font-display text-gray-200 font-bold text-sm md:text-base whitespace-nowrap bg-gradient-to-r from-cyan-300 to-red-400 bg-clip-text text-transparent"
              animate={isHovered ? {
                letterSpacing: '2px',
                scale: 1.05
              } : {
                letterSpacing: '0px',
                scale: 1 
              }}
              transition={{ duration: 0.3 }}
            >
              {sponsor.name}
            </motion.h3>
            
            {/* Bottom glow line */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-cyan-300 to-red-400"
              animate={isHovered ? {
                scaleX: 1,
                opacity: 1
              } : {
                scaleX: 0.5,
                opacity: 0.3
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Floating elements on hover */}
          {isHovered && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: i % 2 === 0 ? '#00ffff' : '#ff1a1a'
                  }}
                  animate={{
                    x: [0, Math.cos((i / 4) * Math.PI * 2) * 80],
                    y: [0, Math.sin((i / 4) * Math.PI * 2) * 80],
                    opacity: [1, 0],
                  }}
                  transition={{ duration: 1.2, delay: i * 0.1, repeat: Infinity }}
                />
              ))}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const AnimatedCardsRow = ({ sponsors, direction = 'left', rowIndex = 0 }) => {
  // Create infinite loop by duplicating
  const extendedSponsors = [...sponsors, ...sponsors];
  
  const containerVariants = {
    animate: {
      x: direction === 'left' ? ['0%', '-100%'] : ['-100%', '0%'],
      transition: {
        duration: 40,
        repeat: Infinity,
        ease: 'linear',
        repeatType: 'loop',
      },
    },
  };

  return (
    <div className="w-full overflow-hidden">
      <motion.div
        className="flex gap-6 md:gap-8"
        variants={containerVariants}
        animate="animate"
      >
        {extendedSponsors.map((sponsor, idx) => (
          <div key={`${sponsor.name}-${idx}`} className="min-w-max">
            <SponsorCard sponsor={sponsor} index={idx} />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Sponsors = () => {
  // Split sponsors into two rows
  const firstRow = sponsorsList.slice(0, 4);
  const secondRow = sponsorsList.slice(4, 8);

  return (
    <section
      id="sponsors"
      className="relative py-16 md:py-32 bg-deep-dark text-gray-300 overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ff1a1a 1px, transparent 1px),
            linear-gradient(to bottom, #ff1a1a 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-[120px]"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-500/10 rounded-full blur-[120px]"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header section */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="relative inline-block">
            <motion.div
              className="absolute -top-4 left-1/4 -translate-x-1/2 w-2/4 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl uppercase text-white mb-4 relative">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                OUR
              </motion.span>{' '}
              <motion.span
                className="text-bright-red"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                SPONSORS
              </motion.span>
            </h2>
            <motion.div
              className="absolute -bottom-4 left-1/4 -translate-x-1/2 w-2/4 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="text-gray-400 text-base sm:text-lg mt-6 max-w-2xl mx-auto">
            We are proud to partner with industry leaders who support our mission of fostering innovation.
          </p>
        </motion.div>

        {/* Animated cards carousel */}
        <div className="space-y-8 md:space-y-12">
          {/* First row - left to right */}
          <AnimatedCardsRow sponsors={firstRow} direction="left" rowIndex={0} />
          
          {/* Second row - right to left */}
          <AnimatedCardsRow sponsors={secondRow} direction="right" rowIndex={1} />
        </div>
      </div>
    </section>
  );
};

export default Sponsors;