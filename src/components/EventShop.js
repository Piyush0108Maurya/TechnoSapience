import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { firebaseDB } from '../firebaseUtils';

const EventShop = ({ cart, addToCart, toggleCart }) => {
  const [eventProducts, setEventProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [participantCounts, setParticipantCounts] = useState({});
  const [userRegistrations, setUserRegistrations] = useState({});
  const [eventBans, setEventBans] = useState({});

  const loadEvents = useCallback(async () => {
    try {
      const result = await firebaseDB.getAllEvents();
      if (result.success) {
        setEventProducts(result.data);
        // Load participant counts for each event
        loadParticipantCounts(result.data);
        // Load user registrations
        loadUserRegistrations();
      } else {
        // Fallback to hardcoded events if Firebase fails
        console.warn('Failed to load events from Firebase, using fallback');
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
    loadEventBans();
  }, [loadEvents]);

  const loadEventBans = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const result = await firebaseDB.getUserEventBans(userId);
        if (result.success) {
          setEventBans(result.data || {});
        }
      }
    } catch (error) {
      console.error('Error loading event bans:', error);
    }
  };

  const loadUserRegistrations = async () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        const result = await firebaseDB.getUserRegistrations(userId);
        if (result.success) {
          setUserRegistrations(result.data || {});
        }
      } catch (error) {
        console.error('Error loading user registrations:', error);
      }
    }
  };

  const loadParticipantCounts = async (events) => {
    const counts = {};
    for (const event of events) {
      try {
        const result = await firebaseDB.getEventRegistrations(event.id);
        if (result.success) {
          counts[event.id] = result.data.length;
        } else {
          counts[event.id] = 0;
        }
      } catch (error) {
        console.error(`Error loading participants for event ${event.id}:`, error);
        counts[event.id] = 0;
      }
    }
    setParticipantCounts(counts);
  };

  const categories = ['All', 'Business', 'Gaming', 'Technology', 'Design', 'Analytics', 'Creative', 'Adventure'];

  const filteredEvents = selectedCategory === 'All' 
    ? eventProducts 
    : eventProducts.filter(event => event.category === selectedCategory);

  // Fallback loading state
  if (loading) {
    return (
      <section id="event-shop" className="relative bg-deep-dark text-gray-300 font-body overflow-hidden py-20 md:py-24">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-bright-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="event-shop" className="relative bg-deep-dark text-gray-300 font-body overflow-hidden py-20 md:py-24">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: `
          linear-gradient(to right, #ff1a1a 1px, transparent 1px),
          linear-gradient(to bottom, #ff1a1a 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}></div>
      
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-400/15 rounded-full blur-[120px]"
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative inline-block">
            <motion.div
              className="absolute -top-4 left-1/4 -translate-x-1/2 w-2/4 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <h2 className="font-display font-bold text-4xl md:text-5xl uppercase text-white mb-4">
              <span className="text-cyan-400">Event</span>{' '}
              <span className="text-bright-red">Shop</span>
            </h2>
            <motion.div
              className="absolute -bottom-4 left-1/4 -translate-x-1/2 w-2/4 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="text-gray-400 mt-6 text-lg max-w-2xl mx-auto">
            Select your events and add them to cart. Click again to remove. Events you've already registered for are marked as such. Deactivated events are unavailable for registration. Login required to purchase tickets.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Event Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {filteredEvents.map((event, index) => {
            const inCart = cart.find(item => item.id === event.id);
            const isRegistered = userRegistrations[event.id];
            const isInactive = event.active === false;
            const isBannedFromEvent = eventBans[event.id]?.banned;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-slate-900/50 backdrop-blur-sm rounded-xl overflow-hidden border transition-all group ${
                  isInactive 
                    ? 'border-red-500/50 opacity-75' 
                    : isBannedFromEvent
                      ? 'border-red-600/50 opacity-80'
                      : 'border-slate-800 hover:border-cyan-500/50'
                }`}
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isInactive ? '' : 'group-hover:scale-110'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                  
                  {/* Inactive overlay */}
                  {isInactive && (
                    <div className="absolute inset-0 bg-red-900/30 backdrop-blur-[1px]"></div>
                  )}
                  
                  {/* Event-specific banned overlay */}
                  {isBannedFromEvent && (
                    <div className="absolute inset-0 bg-red-900/50 backdrop-blur-[2px] z-10"></div>
                  )}
                  
                  <div className="absolute top-3 right-3 bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {event.category}
                  </div>
                  
                  {/* Inactive badge */}
                  {isInactive && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Deactivated
                    </div>
                  )}
                  
                  {/* Event-specific banned badge */}
                  {isBannedFromEvent && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold z-20 animate-pulse">
                      🔒 BANNED
                    </div>
                  )}
                  
                  <div className="absolute bottom-3 left-3 text-4xl">
                    {event.icon}
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-white mb-2 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between mb-4 text-sm">
                    <span className="text-gray-400">⏱️ {event.duration}</span>
                    <span className="text-cyan-400 font-semibold">🏆 {event.prize}</span>
                  </div>

                  {/* Participants Progress Bar */}
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <motion.div
                      className="flex items-center justify-between text-sm mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      <span className="text-gray-400">Participants</span>
                      <motion.span
                        className="text-white font-semibold"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                      >
                        {participantCounts[event.id] || 0} / {event.maxTickets || '∞'}
                      </motion.span>
                    </motion.div>

                    <div className="relative w-full bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
                      <motion.div
                        className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 h-3 rounded-full relative"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${event.maxTickets ? Math.min(((participantCounts[event.id] || 0) / event.maxTickets) * 100, 100) : 0}%`
                        }}
                        transition={{
                          duration: 1.2,
                          delay: 0.8,
                          ease: "easeOut"
                        }}
                      >
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{
                            x: ['-100%', '100%']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            repeatDelay: 3
                          }}
                        />

                        {/* Glow effect for high progress */}
                        {event.maxTickets && ((participantCounts[event.id] || 0) / event.maxTickets) > 0.8 && (
                          <motion.div
                            className="absolute inset-0 bg-cyan-400/50 rounded-full blur-sm"
                            animate={{
                              opacity: [0.3, 0.8, 0.3],
                              scale: [1, 1.05, 1]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        )}
                      </motion.div>

                      {/* Pulse effect for full events */}
                      {event.maxTickets && ((participantCounts[event.id] || 0) / event.maxTickets) >= 1 && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full"
                          animate={{
                            opacity: [0.2, 0.6, 0.2],
                            scale: [1, 1.02, 1]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </div>

                    {/* Status indicator */}
                    <motion.div
                      className="flex items-center justify-center mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 1.2 }}
                    >
                      {event.maxTickets && ((participantCounts[event.id] || 0) / event.maxTickets) >= 1 ? (
                        <motion.span
                          className="text-xs text-red-400 font-medium flex items-center gap-1"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                          Event Full
                        </motion.span>
                      ) : event.maxTickets && ((participantCounts[event.id] || 0) / event.maxTickets) > 0.8 ? (
                        <motion.span
                          className="text-xs text-orange-400 font-medium flex items-center gap-1"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                          Almost Full
                        </motion.span>
                      ) : (
                        <motion.span
                          className="text-xs text-green-400 font-medium flex items-center gap-1"
                          animate={{ opacity: [0.8, 1, 0.8] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                          {event.maxTickets ? 'Available' : 'Unlimited'}
                        </motion.span>
                      )}
                    </motion.div>
                  </motion.div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div>
                      <div className="text-2xl font-bold text-white">₹{event.price}</div>
                      <div className="text-xs text-gray-500">per ticket</div>
                    </div>
                    
                    {isInactive ? (
                      <div className="flex items-center gap-2 bg-red-600/20 border border-red-500 rounded-lg px-4 py-2 cursor-not-allowed">
                        <span className="text-red-400 font-bold text-sm">🔒 Deactivated</span>
                      </div>
                    ) : isBannedFromEvent ? (
                      <div className="flex items-center gap-2 bg-red-600/20 border border-red-500 rounded-lg px-4 py-2 cursor-not-allowed">
                        <span className="text-red-400 font-bold text-sm">🚫 Banned from Event</span>
                      </div>
                    ) : isRegistered ? (
                      <div className="flex items-center gap-2 bg-green-600/20 border border-green-500 rounded-lg px-4 py-2 cursor-not-allowed">
                        <span className="text-green-400 font-bold text-sm">✓ Already Registered</span>
                      </div>
                    ) : inCart ? (
                      <motion.button
                        onClick={() => toggleCart(event, userRegistrations, participantCounts)}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all hover:scale-105 flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Minus size={18} />
                        Remove from Cart
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={() => toggleCart(event, userRegistrations, participantCounts)}
                        disabled={event.maxTickets && ((participantCounts[event.id] || 0) / event.maxTickets) >= 1}
                        className={`bg-gradient-to-r text-white px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 ${
                          event.maxTickets && ((participantCounts[event.id] || 0) / event.maxTickets) >= 1
                            ? 'from-gray-500 to-gray-600 cursor-not-allowed opacity-50'
                            : 'from-cyan-500 to-cyan-600 hover:shadow-lg hover:shadow-cyan-500/50'
                        }`}
                        whileHover={{ scale: event.maxTickets && ((participantCounts[event.id] || 0) / event.maxTickets) >= 1 ? 1 : 1.05 }}
                        whileTap={{ scale: event.maxTickets && ((participantCounts[event.id] || 0) / event.maxTickets) >= 1 ? 1 : 0.95 }}
                      >
                        <Plus size={18} />
                        {event.maxTickets && ((participantCounts[event.id] || 0) / event.maxTickets) >= 1 ? 'Event Full' : 'Add to Cart'}
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default EventShop;
