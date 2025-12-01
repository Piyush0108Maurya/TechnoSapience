import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const featureCards = [
  {
    title: '2-Day Intensive Event',
    description: 'Immerse yourself in 48 hours of non-stop challenges, workshops, and networking.',
    icon: '📅',
  },
  {
    title: 'Diverse Competitions',
    description: 'From coding and gaming to graphic design and storytelling, there\'s a challenge for every talent.',
    icon: '🏆',
  },
  {
    title: 'Entrepreneurial Arena',
    description: 'Pitch your groundbreaking ideas to a panel of experts in our "Shark Tank" style event.',
    icon: '🚀',
  },
  {
    title: 'Creative & Fun Events',
    description: 'Unleash your creativity in our expo, or test your wits in the campus-wide Hunt Safari.',
    icon: '🎨',
  },
];

const About = () => {
  const ref = useRef(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  return (
    <section
      ref={ref}
      id="about"
      className="relative py-16 md:py-20 bg-deep-dark text-gray-300 font-body animate-grid-scroll"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 26, 26, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 26, 26, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    >
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={itemVariants}
        > 
          <div className="relative inline-block">
            <motion.div
              className="absolute -top-4 left-1/4 -translate-x-1/2 w-2/4 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: 0.3 }}
            ></motion.div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl uppercase text-white mb-4 relative">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                About The
              </motion.span>{' '}
              <motion.span 
                className="text-bright-red"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Event
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

        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={itemVariants}
            className="max-w-3xl mx-auto text-center text-base sm:text-lg md:text-xl leading-relaxed mb-16 md:mb-20"
        >
          <motion.p variants={itemVariants}>
            TechnoSapiens is not just a tech fest; it's a two-day celebration of innovation in all its forms. It's where coding prowess meets creative storytelling, data analysis, and entrepreneurial spirit. Prepare for an electrifying experience that goes beyond code, featuring everything from intense gaming competitions and graphic design battles to a 'Shark Tank' style pitching arena and a campus-wide treasure hunt.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featureCards.map((card) => (
            <motion.div 
              key={card.title} 
              variants={itemVariants} 
              className="group relative bg-gray-900/50 border border-red-500/20 rounded-lg p-6 md:p-8 text-center overflow-hidden transition-all duration-300 hover:border-red-500/60 hover:shadow-2xl hover:shadow-red-500/10"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-4xl sm:text-5xl mb-6 text-bright-red transform group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-3">{card.title}</h3>
                <p className="text-gray-400 leading-relaxed">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;