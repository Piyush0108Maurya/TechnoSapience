import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from '../images/logo.png';
import { firebaseDB } from '../firebaseUtils';

const EditProfile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    college: 'IITM Janakpuri',
    phone: '+91 9876543210'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
              college: profileData.college || '',
              phone: profileData.phone || '',
            });
          } else {
            // Fallback to localStorage data if Firebase fails
            setUser(prev => ({ ...prev, email: email || prev.email }));
          }
        } else if (email) {
          // Fallback for users without userId
          setUser(prev => ({ ...prev, email }));
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

  const handleInputChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('User not authenticated. Please log in again.');
        return;
      }

      // Prepare update data (name stays the same, only update college and phone)
      const updateData = {
        college: user.college,
        phone: user.phone,
      };

      // Update user profile in Firebase
      const result = await firebaseDB.updateUserProfile(userId, updateData);

      if (result.success) {
        alert('Profile updated successfully!');
        // Redirect back to profile page
        window.location.href = '/profile';
      } else {
        alert(`Failed to update profile: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    window.location.href = '/profile';
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
    <div className="min-h-screen bg-deep-dark flex items-center justify-center p-4">
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

      {/* Back Button */}
      <button
        onClick={goBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Back to Profile</span>
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
            Edit Profile
          </motion.h1>
        </div>

        {/* Form */}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              className="w-full px-4 py-3 text-sm bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 placeholder-gray-400 cursor-not-allowed"
              placeholder="Enter your full name"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">Name cannot be changed (matches your login registration)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bright-red focus:ring-1 focus:ring-bright-red/50 transition-all duration-300 backdrop-blur-sm"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              College
            </label>
            <input
              type="text"
              name="college"
              value={user.college}
              onChange={handleInputChange}
              className="w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bright-red focus:ring-1 focus:ring-bright-red/50 transition-all duration-300 backdrop-blur-sm"
              placeholder="Your college name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleInputChange}
              className="w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bright-red focus:ring-1 focus:ring-bright-red/50 transition-all duration-300 backdrop-blur-sm"
              placeholder="+91 9876543210"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-bright-red to-dark-red hover:from-dark-red hover:to-bright-red text-white font-bold py-2 sm:py-3 px-4 text-xs sm:text-sm rounded-lg transition-all duration-300 shadow-neon-red hover:shadow-neon-dark-red disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving && (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            )}
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default EditProfile;
