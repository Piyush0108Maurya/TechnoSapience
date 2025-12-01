import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from '../images/logo.png';
import LogoutModal from '../components/LogoutModal';
import { firebaseAuth, firebaseDB } from '../firebaseUtils';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    college: 'IITM Janakpuri',
    phone: '+91 9876543210',
    avatar: null
  });
  const [loading, setLoading] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Get user ID from localStorage (set during login)
        const userId = localStorage.getItem('userId');
        const email = localStorage.getItem('userEmail');

        if (userId) {
          // Load user profile from Firebase Realtime Database
          const profileResult = await firebaseDB.getUserProfile(userId);
          if (profileResult.success) {
            const profileData = profileResult.data;
            setUser({
              name: profileData.name || email.split('@')[0],
              email: profileData.email || email,
              college: profileData.college || 'Not specified',
              phone: profileData.phone || 'Not specified',
              avatar: profileData.avatarUrl || null,
              registrationDate: profileData.registrationDate,
              role: profileData.role || 'user'
            });
          } else {
            // Fallback to localStorage data if Firebase fails
            setUser(prev => ({ ...prev, email: email || prev.email }));
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
        console.error('Error loading user profile:', error);
        // Fallback to localStorage
        const email = localStorage.getItem('userEmail');
        if (email) {
          setUser(prev => ({ ...prev, email }));
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const goEditProfile = () => {
    window.location.href = '/edit-profile';
  };

  const goDashboard = () => {
    window.location.href = '/dashboard';
  };

  const openLogoutModal = () => {
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

  const goHome = () => {
    // Generate new avatar seed each time back to home is clicked
    try {
      localStorage.setItem('userAvatarSeed', Math.random().toString(36).substring(7));
    } catch (error) {
      console.error('Error setting avatar seed:', error);
    }
    window.location.href = '/';
  };

  const getAvatarSeed = () => {
    try {
      return localStorage.getItem('userAvatarSeed') || 'default';
    } catch (error) {
      console.error('Error getting avatar seed:', error);
      return 'default';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-bright-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-dark">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 26, 26, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 26, 26, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Back to Home Button */}
      <button
        onClick={goHome}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Back to Home</span>
      </button>

      {/* TechnoSapiens Logo */}
      <div className="absolute top-6 right-6 flex items-center space-x-3">
        <img
          src={logo}
          alt="TechnoSapiens Logo"
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-full"
          style={{
            clipPath: 'circle(50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '1px'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback text logo */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-bright-red rounded-full items-center justify-center text-black font-bold text-lg hidden">
          TS
        </div>
        <span className="hidden sm:inline font-display text-lg tracking-widest text-bright-red uppercase">
          TECHNO<span className="text-gray-200">SAPIENS</span>
        </span>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-bright-red/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-neon-red relative z-10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl sm:text-4xl font-display font-black text-transparent bg-gradient-to-r from-bright-red via-cyan-400 to-bright-red bg-clip-text mb-4 tracking-wide"
            >
              My Profile
            </motion.h1>
          </div>

          {/* Profile Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Avatar */}
            <div className="flex justify-center">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${getAvatarSeed()}`}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full bg-gradient-to-br from-bright-red to-dark-red"
              />
            </div>

            {/* User Info */}
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-2">{user.name}</h2>
                <p className="text-gray-300">{user.email}</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">College:</span>
                  <span className="text-white">{user.college}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-white">{user.phone}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={goEditProfile}
                className="flex-1 bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-neon-cyan hover:shadow-neon-cyan-dark"
              >
                Edit Profile
              </button>
              <button
                onClick={goDashboard}
                className="flex-1 bg-gradient-to-r from-bright-red to-dark-red hover:from-dark-red hover:to-bright-red text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-neon-red hover:shadow-neon-dark-red"
              >
                Dashboard
              </button>
            </div>

            {/* Logout Button */}
            <div className="pt-4 border-t border-gray-700">
              <button
                onClick={openLogoutModal}
                className="w-full bg-transparent border border-gray-400 text-gray-400 hover:bg-gray-400/10 hover:text-gray-300 font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />

    </div>
  );
};

export default Profile;
