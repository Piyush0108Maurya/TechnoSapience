import React from 'react';
import { motion } from 'framer-motion';
import logo from '../images/logo.png';

const TermsAndConditions = () => {
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
            Terms and Conditions
          </motion.h1>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-gray-300 space-y-6"
        >
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using TechnoSapiens, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Use License</h2>
            <p className="leading-relaxed">
              Permission is granted to temporarily download one copy of the materials on TechnoSapiens for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Disclaimer</h2>
            <p className="leading-relaxed">
              The materials on TechnoSapiens are provided on an 'as is' basis. TechnoSapiens makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Limitations</h2>
            <p className="leading-relaxed">
              In no event shall TechnoSapiens or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TechnoSapiens, even if TechnoSapiens or a TechnoSapiens authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Accuracy of Materials</h2>
            <p className="leading-relaxed">
              The materials appearing on TechnoSapiens could include technical, typographical, or photographic errors. TechnoSapiens does not warrant that any of the materials on its website are accurate, complete, or current.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">6. Links</h2>
            <p className="leading-relaxed">
              TechnoSapiens has not reviewed all of the sites linked to its Internet website and is not responsible for the contents of any such linked site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">7. Modifications</h2>
            <p className="leading-relaxed">
              TechnoSapiens may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">8. Governing Law</h2>
            <p className="leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
            </p>
          </section>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TermsAndConditions;
