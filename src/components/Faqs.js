import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const faqData = [
  {
    question: 'What is TechnoSapiens?',
    answer: 'TechnoSapiens is the flagship annual tech festival of IITM Janakpuri, bringing together students from various disciplines to compete, innovate, and learn. It features a wide range of events from competitive programming and robotics to design challenges and entrepreneurial pitches.'
  },
  {
    question: 'Who can participate in the events?',
    answer: 'Participation is open to all undergraduate and postgraduate students from any recognized university or college. Some events may have specific prerequisites, which will be mentioned on their respective event pages.'
  },
  {
    question: 'Is there a registration fee?',
    answer: 'Most events are free to participate in. However, some specialized workshops or premium competitions might have a nominal registration fee to cover costs. Please check the details on the specific event page.'
  },
  {
    question: 'How do I register for an event?',
    answer: 'You can register for any event through our official website. Simply navigate to the Events section, choose the event you are interested in, and click the "Register Now" button. You may need to form a team for certain competitions.'
  },
  {
    question: 'What are the prizes?',
    answer: 'We have a huge prize pool including cash rewards, internships with top tech companies, premium software licenses, and exclusive goodies. The specific prizes vary by event.'
  },
];

const AccordionItem = ({ i, expanded, setExpanded, question, answer }) => {
  const isOpen = i === expanded;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      className="relative group"
    >
      {/* Vertical line connector */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400/50 via-red-500/50 to-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Circle indicator */}
      <motion.div
        className="absolute left-0 top-6 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-cyan-400/30 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
        animate={isOpen ? {
          borderColor: 'rgba(0, 255, 255, 0.8)',
          backgroundColor: 'rgba(0, 255, 255, 0.1)',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)'
        } : {}}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className="w-5 h-5 text-cyan-400" />
        </motion.div>
      </motion.div>

      {/* Main card content */}
      <div className="ml-16 sm:ml-24">
        <motion.button
          onClick={() => setExpanded(isOpen ? false : i)}
          className="w-full text-left mb-0"
          whileHover={{ x: 8 }}
          transition={{ duration: 0.2 }}
        >
          {/* Card header */}
          <motion.div
            className="relative overflow-hidden rounded-lg p-4 sm:p-5 bg-gradient-to-r from-slate-800/40 to-slate-900/40 border-l-4 border-b border-slate-700/50"
            animate={isOpen ? {
              borderLeftColor: '#00ffff',
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              borderBottomColor: 'rgba(255, 26, 26, 0.5)'
            } : {
              borderLeftColor: 'rgba(100, 116, 139, 0.3)',
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              borderBottomColor: 'rgba(71, 85, 105, 0.3)'
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Shimmer effect on hover */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={isOpen ? { 
                opacity: 0.3,
                backgroundPosition: ['0% 0%', '100% 0%']
              } : {}}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent)',
                backgroundSize: '200% 100%'
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="relative z-10 flex items-start justify-between gap-4">
              <h3 className={`font-display font-semibold text-base sm:text-lg md:text-xl leading-tight transition-colors duration-300 ${
                isOpen ? 'text-cyan-300' : 'text-white group-hover:text-cyan-200'
              }`}>
                {question}
              </h3>
              
              {/* Badge indicator */}
              <motion.span
                className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap mt-1"
                animate={isOpen ? {
                  backgroundColor: 'rgba(0, 255, 255, 0.2)',
                  color: '#00ffff'
                } : {
                  backgroundColor: 'rgba(71, 85, 105, 0.2)',
                  color: '#94a3b8'
                }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? 'OPEN' : 'CLOSED'}
              </motion.span>
            </div>
          </motion.div>
        </motion.button>

        {/* Answer section */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ 
                opacity: 1, 
                height: 'auto',
                y: 0,
                transition: {
                  height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                  opacity: { duration: 0.3, delay: 0.1 },
                  y: { duration: 0.3, delay: 0.1 }
                }
              }}
              exit={{ 
                opacity: 0, 
                height: 0,
                y: -10,
                transition: {
                  height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                  opacity: { duration: 0.2 }
                }
              }}
              className="overflow-hidden"
            >
              <motion.div
                className="relative mt-3 p-5 rounded-lg bg-gradient-to-br from-cyan-500/10 via-slate-900/50 to-red-500/10 border border-cyan-400/30 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                {/* Animated border line */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />

                {/* Numbered badge */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <motion.div
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-red-500 flex items-center justify-center text-white text-xs font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ✓
                    </motion.div>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                      {answer}
                    </p>
                  </div>
                </div>

                {/* Corner accents */}
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-red-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 0.3 }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Faqs = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="faqs" className="relative py-16 md:py-32 bg-deep-dark text-gray-300 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: `linear-gradient(to right, #ff1a1a 1px, transparent 1px), linear-gradient(to bottom, #ff1a1a 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}></div>
      <motion.div
        className="absolute top-1/3 -left-32 w-96 h-96 bg-cyan-400/15 rounded-full blur-[120px]"
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-red-500/15 rounded-full blur-[120px]"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header section - matching sponsors style */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="relative inline-block">
            <motion.div
              className="absolute -top-4 left-1/4 -translate-x-1/2 w-2/4 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl uppercase text-white mb-4 relative">
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Frequently
              </motion.span>{' '}
              <motion.span
                className="text-bright-red"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Asked
              </motion.span>
            </h2>
            <motion.div
              className="absolute -bottom-4 left-1/4 -translate-x-1/2 w-2/4 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>

          {/* Subtitle */}
          <motion.p
            className="text-gray-400 text-base sm:text-lg mt-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Have questions? We've got answers. Here are some of the most common queries we receive.
          </motion.p>
        </motion.div>

        {/* FAQ Timeline Container */}
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          {faqData.map((faq, i) => (
            <AccordionItem
              key={i}
              i={i}
              expanded={expanded}
              setExpanded={setExpanded}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faqs;