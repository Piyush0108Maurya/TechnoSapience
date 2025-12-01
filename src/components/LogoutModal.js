import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-bright-red/30 rounded-3xl p-8 sm:p-12 w-full max-w-sm sm:max-w-md lg:max-w-lg relative shadow-2xl shadow-bright-red/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-transparent bg-gradient-to-r from-bright-red via-cyan-400 to-bright-red bg-clip-text mb-4 tracking-wide">
              Logout
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl font-medium">
              Do you want to logout?
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-transparent border border-gray-600 text-gray-300 font-semibold py-3 px-6 rounded-xl hover:bg-gray-700 transition-colors duration-300"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="w-full sm:w-auto bg-gradient-to-r from-bright-red to-dark-red hover:from-dark-red hover:to-bright-red text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-neon-red"
            >
              Yes
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LogoutModal;
