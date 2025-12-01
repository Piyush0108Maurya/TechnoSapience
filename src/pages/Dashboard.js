import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from '../images/logo.png';
import LogoutModal from '../components/LogoutModal';
import { firebaseAuth, firebaseDB } from '../firebaseUtils';

const Dashboard = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    college: 'IITM Janakpuri',
    phone: '+91 9876543210'
  });
  const [loading, setLoading] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [eventStats, setEventStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalRegistrations: 0,
    confirmedPayments: 0,
  });

  const [notifications] = useState([
    {
      id: 1,
      type: 'reminder',
      title: 'AI/ML Workshop Tomorrow',
      message: 'Don\'t forget about your AI/ML Workshop starting at 10:00 AM tomorrow.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'update',
      title: 'Venue Change - Web Development Hackathon',
      message: 'The venue has been changed to Main Auditorium. Please check your updated ticket.',
      time: '1 day ago',
      read: false
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Confirmation',
      message: 'Your payment for AI/ML Workshop has been confirmed. Receipt available in payments section.',
      time: '3 days ago',
      read: true
    }
  ]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get user ID from localStorage (set during login)
        const userId = localStorage.getItem('userId');
        const email = localStorage.getItem('userEmail');

        if (userId) {
          // Load user profile from Firebase Realtime Database
          const profileResult = await firebaseDB.getUserProfile(userId);
          if (profileResult.success) {
            const profileData = profileResult.data;
            // Check if profile is complete
            if (!firebaseDB.isProfileComplete(profileData)) {
              window.location.href = '/edit-profile';
              return; // Prevent further loading
            }
            setUser({
              name: profileData.name || email.split('@')[0],
              email: profileData.email || email,
              college: profileData.college || 'Not specified',
              phone: profileData.phone || 'Not specified',
            });
          } else {
            // Fallback to localStorage data if Firebase fails
            setUser(prev => ({ ...prev, email: email || prev.email }));
          }

          // Load user's registered events
          const eventsResult = await firebaseDB.getUserRegistrations(userId);
          if (eventsResult.success) {
            const registrations = eventsResult.data || {};
            // Convert registrations object to array format expected by Dashboard
            const eventsArray = Object.entries(registrations).map(([eventId, eventData]) => ({
              id: eventId,
              name: eventData.eventName || eventData.name || 'Unknown Event',
              date: eventData.eventDate || eventData.date || new Date().toISOString().split('T')[0],
              time: eventData.eventTime || eventData.time || 'TBD',
              status: eventData.status || 'registered',
              paymentId: eventData.paymentId || null,
              qrCode: eventData.qrCode || null,
              venue: eventData.venue || 'TBD',
            }));
            setRegisteredEvents(eventsArray);
          }

          // Load event statistics
          const statsResult = await firebaseDB.getEventStats();
          if (statsResult.success) {
            setEventStats(statsResult.data);
          }
        } else if (email) {
          // Fallback for users without userId
          setUser(prev => ({ ...prev, email }));
        }

        // Generate random avatar seed if not exists
        if (!localStorage.getItem('userAvatarSeed')) {
          localStorage.setItem('userAvatarSeed', Math.random().toString(36).substring(7));
        }
      } catch (error) {
        console.error('Error loading user data in Dashboard:', error);
        // Fallback to localStorage
        const email = localStorage.getItem('userEmail');
        if (email) {
          setUser(prev => ({ ...prev, email }));
        }
        // Set empty events array on error
        setRegisteredEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const goHome = () => {
    window.location.href = '/';
  };

  const goEditProfile = () => {
    window.location.href = '/edit-profile';
  };

  const logout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    try {
      // Sign out from Firebase
      await firebaseAuth.signOut();

      // Clear localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      localStorage.removeItem('userAvatarSeed');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear localStorage even if Firebase logout fails
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      localStorage.removeItem('userAvatarSeed');
    }
    setIsLogoutModalOpen(false);
    window.location.href = '/';
  };

  const getAvatarSeed = () => {
    try {
      return localStorage.getItem('userAvatarSeed') || 'default';
    } catch (error) {
      console.error('Error getting avatar seed in Dashboard:', error);
      return 'default';
    }
  };


  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2 sm:px-3 py-1 text-xs font-bold uppercase bg-green-500/20 text-green-400 border border-green-500/30 rounded-full whitespace-nowrap">
            ✅ Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 sm:px-3 py-1 text-xs font-bold uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full whitespace-nowrap">
            ⏳ Pending Payment
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 sm:px-3 py-1 text-xs font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full whitespace-nowrap">
            ✔️ Completed
          </span>
        );
      default:
        return (
          <span className="px-2 sm:px-3 py-1 text-xs font-bold uppercase bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-full whitespace-nowrap">
            📅 Upcoming
          </span>
        );
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-deep-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-bright-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-deep-dark text-gray-300">
      {/* Background Grid Pattern */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 26, 26, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 26, 26, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header */}
      <div className="relative z-10 bg-gray-900/90 backdrop-blur-xl border-b border-bright-red/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={goHome}
                className="flex items-center gap-1 sm:gap-2 text-gray-400 hover:text-white transition-colors group"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Home</span>
              </button>
              
              <div className="flex items-center space-x-2 sm:space-x-3">
                <img 
                  src={logo} 
                  alt="TechnoSapiens Logo" 
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full"
                  style={{
                    clipPath: 'circle(50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: '2px'
                  }}
                  onError={(e) => {
                    // Fallback to text logo if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback text logo */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-bright-red rounded-full items-center justify-center text-black font-bold text-lg sm:text-2xl hidden">
                  TS
                </div>
              </div>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:block text-right">
                <p className="font-medium text-white">{user.name}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold uppercase font-condensed text-bright-red bg-transparent border border-bright-red rounded-full hover:bg-bright-red/10 hover:shadow-neon-red transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 xl:px-12 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Enhanced Welcome Section with Profile */}
          <div className="mb-12 lg:mb-16">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12 mb-8">
              <div className="flex-1 lg:max-w-2xl">
                {/* Enhanced Welcome Title */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="mb-6"
                >
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-black text-transparent bg-gradient-to-r from-bright-red via-cyan-400 to-bright-red bg-clip-text mb-4 leading-tight">
                    Welcome Back,
                    <br className="hidden lg:block" />
                    <span className="lg:block">{user.name.split(' ')[0]}!</span>
                  </h1>
                  <div className="w-24 lg:w-32 h-1 bg-gradient-to-r from-bright-red to-cyan-400 rounded-full mb-6"></div>
                  <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-lg">
                    Your central hub for all TechnoSapiens events and activities.
                    <span className="block mt-2 text-cyan-400 font-medium">Manage your registrations, view tickets, and stay updated.</span>
                  </p>
                </motion.div>
                
                {/* Quick Stats Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="hidden lg:flex items-center gap-8 mt-8"
                >
                  <div className="text-center">
                    <p className="text-2xl font-bold text-bright-red">{eventStats.activeEvents}</p>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Active Events</p>
                  </div>
                  <div className="w-px h-12 bg-gray-600"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-cyan-400">{registeredEvents.length}</p>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">My Events</p>
                  </div>
                  <div className="w-px h-12 bg-gray-600"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-400">{eventStats.confirmedPayments}</p>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Confirmed Payments</p>
                  </div>
                </motion.div>
              </div>
              
              {/* Enhanced Profile Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-bright-red/40 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-bright-red/20 lg:min-w-[350px] xl:min-w-[400px] relative overflow-hidden"
              >
                {/* Profile Card Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-bright-red/5 via-transparent to-cyan-400/5 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl lg:text-2xl font-display font-bold text-white flex items-center gap-3">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${getAvatarSeed()}`}
                        alt="Profile Avatar"
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-bright-red to-dark-red"
                      />
                      Profile
                    </h2>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>

                  <div className="space-y-4 lg:space-y-5">
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                      <label className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Full Name</label>
                      <p className="text-white font-semibold text-lg mt-1">{user.name}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                      <label className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Email</label>
                      <p className="text-cyan-400 font-medium text-sm mt-1 break-all">{user.email}</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                        <label className="text-xs text-gray-400 uppercase tracking-wide font-semibold">College</label>
                        <p className="text-white font-medium text-sm mt-1">{user.college}</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                        <label className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Phone</label>
                        <p className="text-white font-medium text-sm mt-1">{user.phone}</p>
                      </div>
                    </div>
                  </div>

                  <button onClick={goEditProfile} className="w-full mt-6 px-6 py-3 text-sm font-bold uppercase tracking-wide text-bright-red bg-gradient-to-r from-bright-red/10 to-cyan-400/10 border border-bright-red/30 rounded-xl hover:from-bright-red/20 hover:to-cyan-400/20 hover:border-bright-red/50 hover:shadow-lg hover:shadow-bright-red/25 transition-all duration-300">
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Stats Cards - Mobile Only */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 lg:hidden">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-bright-red/30 rounded-2xl p-6 shadow-neon-red"
            >
              <h3 className="text-sm font-medium text-gray-400 mb-2">Active Events</h3>
              <p className="text-3xl font-bold text-bright-red">{eventStats.activeEvents}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-6 shadow-lg shadow-cyan-400/20"
            >
              <h3 className="text-sm font-medium text-gray-400 mb-2">My Events</h3>
              <p className="text-3xl font-bold text-cyan-400">
                {registeredEvents.length}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-6 shadow-lg shadow-yellow-400/20"
            >
              <h3 className="text-sm font-medium text-gray-400 mb-2">Confirmed Payments</h3>
              <p className="text-3xl font-bold text-yellow-400">
                {eventStats.confirmedPayments}
              </p>
            </motion.div>
          </div>

          {/* Enhanced Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Events Panel - Takes 2 columns on desktop */}
            <div className="lg:col-span-2 space-y-8">
              {/* Registered Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-bright-red/40 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-bright-red/20 relative overflow-hidden"
              >
                {/* Events Panel Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-bright-red/5 via-transparent to-cyan-400/5 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl lg:text-3xl font-display font-bold text-white flex items-center gap-3">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-bright-red to-dark-red rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      My Registered Events
                    </h2>
                    <div className="hidden lg:flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Active</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {registeredEvents.length} Total Events
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {registeredEvents.length > 0 ? (
                      registeredEvents.map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="relative bg-gradient-to-r from-gray-800/60 to-gray-800/40 border border-gray-600/50 rounded-2xl p-6 hover:border-bright-red/50 hover:shadow-lg hover:shadow-bright-red/10 transition-all duration-300 group"
                        >
                          {/* Status Glowing Dot */}
                          <div className="absolute top-4 right-4 z-10">
                            {event.status === 'confirmed' && (
                              <div className="relative">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
                                <div className="absolute inset-0 w-3 h-3 bg-green-400/50 rounded-full blur-sm"></div>
                              </div>
                            )}
                            {event.status === 'pending' && (
                              <div className="relative">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                                <div className="absolute inset-0 w-3 h-3 bg-yellow-400/50 rounded-full blur-sm"></div>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors flex-1 min-w-0">{event.name}</h3>
                                <div className="flex-shrink-0">
                                  {getStatusBadge(event.status)}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-300">
                                  <div className="w-8 h-8 bg-bright-red/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-bright-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
                                    <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 text-gray-300">
                                  <div className="w-8 h-8 bg-cyan-400/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Time</p>
                                    <p className="font-medium">{event.time}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 text-gray-300">
                                  <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Venue</p>
                                    <p className="font-medium">{event.venue}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4 mt-4">
                              {event.status === 'confirmed' && (
                                <button className="flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase bg-gradient-to-r from-cyan-400/20 to-blue-400/20 text-cyan-400 border border-cyan-400/30 rounded-xl hover:from-cyan-400/30 hover:to-blue-400/30 hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  View QR Pass
                                </button>
                              )}
                              
                              {event.status === 'pending' && (
                                <button className="flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase bg-gradient-to-r from-bright-red to-dark-red text-white rounded-xl hover:from-dark-red hover:to-bright-red hover:shadow-lg hover:shadow-bright-red/25 transition-all duration-300">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                  </svg>
                                  Pay Now
                                </button>
                              )}
                              
                              <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Details
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Events Registered</h3>
                        <p className="text-gray-400 mb-6">You haven't registered for any events yet. Browse our events page to get started!</p>
                        <button 
                          onClick={() => {
                            // Navigate to home page and scroll to events section
                            window.location.href = '/#events';
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-bright-red to-dark-red hover:from-dark-red hover:to-bright-red text-white font-bold rounded-xl transition-all duration-300 shadow-neon-red hover:shadow-neon-dark-red"
                        >
                          Browse Events
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Enhanced Sidebar - Notifications */}
            <div className="space-y-8">
              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-cyan-400/40 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-cyan-400/20 relative overflow-hidden"
              >
                {/* Notifications Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-blue-400/5 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl lg:text-2xl font-display font-bold text-white flex items-center gap-3">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 17H6l5 5v-5zM12 3v12" />
                        </svg>
                      </div>
                      Notifications
                    </h2>
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>

                  <div className="space-y-4">
                    {notifications.slice(0, 3).map((notification, index) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                          notification.read 
                            ? 'bg-gray-800/40 border-gray-600/50' 
                            : 'bg-gradient-to-r from-cyan-400/10 to-blue-400/10 border-cyan-400/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.read ? 'bg-gray-500' : 'bg-cyan-400 animate-pulse'
                          }`}></div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm mb-2">{notification.title}</h4>
                            <p className="text-xs text-gray-300 mb-3 leading-relaxed">{notification.message}</p>
                            <span className="text-xs text-gray-500 font-medium">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-6 px-6 py-3 text-sm font-bold uppercase tracking-wide text-cyan-400 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 border border-cyan-400/30 rounded-xl hover:from-cyan-400/20 hover:to-blue-400/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300">
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View All Notifications
                    </span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    <LogoutModal
      isOpen={isLogoutModalOpen}
      onClose={() => setIsLogoutModalOpen(false)}
      onConfirm={confirmLogout}
    />
    </>
  );
};

export default Dashboard;
