import React from 'react';
import { motion } from 'framer-motion';
import logo from '../images/logo.png';

const PrivacyPolicy = () => {
  const goBack = () => {
    window.location.href = '/login?mode=signup';
  };


  return (
    <div className="min-h-screen bg-deep-dark flex items-center justify-center p-4">
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

      {/* Back to Previous Button */}
      <button
        onClick={goBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Back</span>
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

      {/* Main Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[280px] sm:max-w-sm lg:max-w-md bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-bright-red/30 rounded-2xl p-3 sm:p-8 pt-20 shadow-2xl shadow-neon-red relative z-10 overflow-y-auto max-h-screen mt-16"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-transparent bg-gradient-to-r from-bright-red via-cyan-400 to-bright-red bg-clip-text mb-4 tracking-wide"
          >
            Privacy Policy
          </motion.h1>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-gray-300 space-y-6"
        >
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="leading-relaxed">
              We collect information you provide directly to us, such as when you create an account, participate in events, or contact us for support.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Information Sharing</h2>
            <p className="leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Data Security</h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Cookies</h2>
            <p className="leading-relaxed">
              We use cookies and similar technologies to collect information about your browsing activities and to distinguish you from other users of our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">6. Your Rights</h2>
            <p className="leading-relaxed">
              You have the right to access, update, or delete your personal information. You may also object to or restrict certain processing of your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">7. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">8. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this privacy policy, please contact us at privacy@technosapiens.com.
            </p>
          </section>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
