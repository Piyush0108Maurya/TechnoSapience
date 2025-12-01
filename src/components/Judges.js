import React from 'react';
import { motion } from 'framer-motion';

// --- Placeholder Images ---
// The user has confirmed these paths are correct.
import judge1Img from '../images/judge1.webp';
import judge2Img from '../images/judge2.webp';
import judge3Img from '../images/judge3.webp';

const judgesData = [
  {
    name: 'Dr. Evelyn Reed',
    title: 'Lead AI Researcher, InnovateCorp',
    image: judge1Img,
    bio: 'A pioneer in neural networks with over 20 years of experience in machine learning.',
    linkedin: '#',
  },
  {
    name: 'Aria Sharma',
    title: 'Principal Engineer, QuantumLeap',
    image: judge2Img,
    bio: 'Specializes in scalable cloud architecture and distributed systems. Author of "The Cloud Native Mindset".',
    linkedin: '#',
  },
  {
    name: 'Arjun Verma',
    title: 'Venture Capitalist, Future Ventures',
    image: judge3Img,
    bio: 'Focuses on early-stage tech startups, turning innovative ideas into market-leading companies.',
    linkedin: '#',
  },
];

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

const Judges = () => {
  return (
     <section
      id="judges"
      className="relative py-20 md:py-32 bg-deep-dark text-gray-300 font-body overflow-hidden"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(to right, #ff1a1a 1px, transparent 1px),
          linear-gradient(to bottom, #ff1a1a 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}></div>

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-bright-red/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
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
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-6xl uppercase text-white mb-4 relative">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Meet The
              </motion.span>{' '}
              <motion.span 
                className="text-bright-red"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Judges
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
          <p className="text-gray-400 text-base sm:text-lg mt-6 max-w-2xl mx-auto">
            Industry experts and visionaries who will evaluate your innovations
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 md:gap-10 mt-28 md:mt-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {judgesData.map((judge) => (
            <motion.div
              key={judge.name}
              variants={itemVariants}              
              whileHover={{ y: -10, scale: 1.03, transition: { type: "spring", stiffness: 300 } }}
              className="group relative bg-gray-900 rounded-xl text-center pt-24 sm:pt-28 p-6"
              style={{ background: 'radial-gradient(circle at 50% 0%, rgba(100, 10, 10, 0.2), transparent 70%), #1a1a1a' }}
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-red-500/30 rounded-tl-xl transition-all duration-300 group-hover:w-24 group-hover:h-24 group-hover:border-red-500"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-red-500/30 rounded-br-xl transition-all duration-300 group-hover:w-24 group-hover:h-24 group-hover:border-red-500"></div>

              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-56 sm:h-56">
                <img
                  src={judge.image}
                  alt={judge.name}
                  className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.5))' }}
                />
              </div>
              <h3 className="relative font-display text-xl sm:text-2xl font-bold text-white mb-1">{judge.name}</h3>
              <p className="relative font-condensed text-sm sm:text-md text-bright-red mb-4">{judge.title}</p>
              <p className="relative text-gray-400 text-sm leading-relaxed mb-6">{judge.bio}</p>
              <a
                href={judge.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-block text-cyan-400 font-bold text-sm uppercase tracking-wider hover:text-white transition-colors"
              >
                View Profile
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Judges;