import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const scheduleData = [
  {
    day: 1,
    time: '9:00 AM',
    title: 'Opening Ceremony & Keynote',
    description: 'Kick off TechnoSapiens with an inspiring keynote from a tech industry visionary.',
    icon: '🎉',
  },
  {
    day: 1,
    time: '11:00 AM',
    title: 'Code Clash Begins',
    description: 'The ultimate competitive programming challenge starts. May the best algorithm win!',
    icon: '💻',
  },
  {
    day: 1,
    time: '1:00 PM',
    title: 'Lunch & Networking',
    description: 'Recharge and connect with fellow innovators, mentors, and sponsors.',
    icon: '🍔',
  },
  {
    day: 1,
    time: '2:30 PM',
    title: 'Workshop: AI & Machine Learning',
    description: 'A hands-on workshop on the latest trends and techniques in artificial intelligence.',
    icon: '🤖',
  },
  {
    day: 1,
    time: '5:00 PM',
    title: 'Shark Tank Pitches - Round 1',
    description: 'Entrepreneurs present their groundbreaking ideas to our panel of judges.',
    icon: '🦈',
  },
  {
    day: 2,
    time: '10:00 AM',
    title: 'Design Duel Finals',
    description: 'Witness the final showdown as top designers compete in a live creative battle.',
    icon: '🎨',
  },
  {
    day: 2,
    time: '12:00 PM',
    title: 'Gaming Showdown: Grand Finals',
    description: 'The climax of the esports tournament. Champions will be crowned.',
    icon: '🎮',
  },
  {
    day: 2,
    time: '2:00 PM',
    title: 'Hunt Safari: The Final Clue',
    description: 'Teams race to solve the final puzzle in the campus-wide digital treasure hunt.',
    icon: '🗺️',
  },
  {
    day: 2,
    time: '4:00 PM',
    title: 'Awards & Closing Ceremony',
    description: 'Celebrating the winners and concluding an unforgettable two days of innovation.',
    icon: '🏆',
  },
];

const ScheduleItem = ({ item, index, scrollProgress }) => {
  const isRight = index % 2 !== 0;
  const itemRef = useRef(null);
  
  // Calculate when this item should appear based on scroll
  const appearThreshold = index * 0.12;
  const fadeThreshold = appearThreshold + 0.1;
  
  const opacity = useTransform(
    scrollProgress,
    [appearThreshold, fadeThreshold],
    [0, 1]
  );
  
  const scale = useTransform(
    scrollProgress,
    [appearThreshold, fadeThreshold],
    [0.8, 1]
  );
  
  const x = useTransform(
    scrollProgress,
    [appearThreshold, fadeThreshold],
    [isRight ? 100 : -100, 0]
  );

  return (
    <motion.div
      ref={itemRef}
      className="relative flex items-center my-6 md:my-16"
      style={{ opacity, scale, x }}
    >
      {/* Animated Timeline Connector for desktop */}
      <motion.div 
        className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-1/2 h-0.5 bg-gradient-to-r ${isRight ? 'from-red-500/40 to-transparent left-0' : 'from-transparent to-red-500/40 right-0'}`}
        style={{
          scaleX: useTransform(scrollProgress, [appearThreshold, fadeThreshold], [0, 1]),
          originX: isRight ? 0 : 1
        }}
      ></motion.div>
      
      {/* Animated Dot with Pulse */}
      <motion.div 
        className="hidden md:block absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10"
        style={{
          scale: useTransform(scrollProgress, [appearThreshold, fadeThreshold], [0, 1]),
          opacity
        }}
      >
        <div className="relative">
          <motion.div 
            className="w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg shadow-red-500/50"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(239, 68, 68, 0.5)',
                '0 0 40px rgba(239, 68, 68, 0.8)',
                '0 0 20px rgba(239, 68, 68, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          ></motion.div>
          <div className="absolute inset-0 w-5 h-5 bg-red-500 rounded-full animate-ping opacity-40"></div>
        </div>
      </motion.div>

      {/* Card */}
      <div className={`w-full md:w-1/2 ${isRight ? 'md:ml-auto md:pl-12' : 'md:pr-12'}`}>
        <motion.div 
          className="group relative bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-red-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-lg overflow-hidden"
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Animated gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-cyan-400/0 to-red-500/0 group-hover:from-cyan-400/5 group-hover:via-transparent group-hover:to-red-500/5 transition-all duration-500"></div>
          
          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-red-500/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative flex items-start gap-4">
            <motion.div 
              className="text-3xl sm:text-4xl mt-1 flex-shrink-0"
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="absolute inset-0 blur-xl opacity-50 text-red-400">{item.icon}</div>
                <div className="relative">{item.icon}</div>
              </div>
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="font-condensed text-red-400 text-xs uppercase tracking-wider">{item.time}</p>
                </div>
              </div> 
              <h3 className="font-display font-bold text-xl md:text-2xl text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300 leading-tight">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{item.description}</p>
            </div>
          </div>
          
          {/* Bottom accent line */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.4 }}
          ></motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const DailyTimeline = ({ day, data, isLastDay }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start center', 'end center'],
  });

  // Transform scroll progress to control timeline length
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={targetRef} className="relative pb-20">
      <motion.div 
        className="flex justify-center my-12 md:my-16"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.8 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
      >
        <div className="relative group">
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-red-500/20 to-cyan-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative font-display font-bold text-3xl md:text-4xl text-white bg-gradient-to-br from-gray-900/90 to-gray-900/70 px-8 sm:px-10 py-3 sm:py-4 border-2 border-red-500/40 rounded-full shadow-2xl backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative flex items-center gap-3">
              <span className="text-cyan-400">Day</span>
              <span className="text-red-500">{day}</span>
              <motion.div
                className="w-2 h-2 bg-cyan-400 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
            </span>
          </div>
        </div>
      </motion.div>

      <div className="relative">
        {/* Enhanced Central Timeline Path - grows with scroll */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 hidden md:block">
          {/* Background line */}
          <div className="absolute inset-0 w-full bg-gray-800/50 rounded-full"></div>
          
          {/* Animated growing line */}
          <motion.div
            className="absolute top-0 left-0 right-0 w-full bg-gradient-to-b from-red-500 via-red-600 to-red-500 rounded-full origin-top shadow-lg shadow-red-500/30"
            style={{ 
              scaleY: pathLength,
              transformOrigin: 'top'
            }}
          >
            {/* Glow effect at the bottom of the growing line */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-red-500 rounded-full blur-lg"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            ></motion.div>
          </motion.div>
        </div>

        <div className="relative">
          {data.map((item, index) => (
            <ScheduleItem 
              key={index} 
              item={item} 
              index={index} 
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
      
      {/* Connection line to next day */}
      {!isLastDay && (
        <motion.div 
          className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-0 w-1 h-20 bg-gradient-to-b from-red-500 to-transparent"
          style={{
            scaleY: pathLength,
            transformOrigin: 'top'
          }}
        ></motion.div>
      )}
    </div>
  );
};

const Schedule = () => {
  const day1Data = scheduleData.filter(item => item.day === 1);
  const day2Data = scheduleData.filter(item => item.day === 2);

  return (
    <section id="schedule" className="relative py-16 md:py-32 bg-deep-dark text-gray-300 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: `linear-gradient(to right, #ff1a1a 1px, transparent 1px), linear-gradient(to bottom, #ff1a1a 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}></div>
      <motion.div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-500/15 rounded-full blur-[120px]" animate={{ x: [0, 50, 0], y: [0, -30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-400/15 rounded-full blur-[120px]" animate={{ x: [0, -50, 0], y: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.8 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="relative inline-block">
            {/* Animated accent lines */}
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
                Event
              </motion.span>{' '}
              <motion.span 
                className="text-bright-red"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Schedule
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

        <div>
          <DailyTimeline day={1} data={day1Data} isLastDay={false} />
          <DailyTimeline day={2} data={day2Data} isLastDay={true} />
        </div>
      </div>
    </section>
  );
};

export default Schedule;