import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from '../images/logo.png';
import { firebaseAuth, firebaseDB } from '../firebaseUtils';

const LoginPage = () => {
  const [mode, setMode] = useState('signin'); // 'signin', 'signup', or 'admin'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    inviteCode: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Valid invite codes for admin signup
  const validInviteCodes = ['TECHNO26ADMIN'];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get('mode');
    if (modeParam && ['signin', 'signup', 'admin'].includes(modeParam)) {
      setMode(modeParam);
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Check for signup validation
    if (mode === 'signup' || mode === 'admin') {
      if (!agreeTerms || !agreePrivacy) {
        alert('Please agree to the Terms and Conditions and Privacy Policy to create an account.');
        setIsLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        setIsLoading(false);
        return;
      }
      if (mode === 'admin' && !validInviteCodes.includes(formData.inviteCode)) {
        alert('Invalid invite code!');
        setIsLoading(false);
        return;
      }
    }

    try {
      if (mode === 'signup' || mode === 'admin') {
        // Create new account with Firebase
        const result = await firebaseAuth.signUp(formData.email, formData.password);
        if (result.success) {
          // Save user profile to Firebase Realtime Database
          const userId = result.user.uid;
          const userRole = mode === 'admin' ? 'admin' : 'user';
          await firebaseDB.saveUserProfile(userId, {
            name: formData.name,
            email: formData.email,
            role: userRole,
            registrationDate: new Date().toISOString(),
          });

          alert('Account created successfully! Please sign in to continue.');
          setMode('signin'); // Switch to signin mode
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            inviteCode: ''
          });
        } else {
          alert(`Signup failed: ${result.error}`);
        }
      } else if (mode === 'signin' || mode === 'admin') {
        // Sign in with Firebase
        const result = await firebaseAuth.signIn(formData.email, formData.password);
        if (result.success) {
          const userId = result.user.uid;

          // Get user profile from Firebase
          const profileResult = await firebaseDB.getUserProfile(userId);
          let userProfile = null;
          if (profileResult.success) {
            userProfile = profileResult.data;
          } else {
            // Create profile if it doesn't exist (for existing users)
            await firebaseDB.saveUserProfile(userId, {
              name: formData.email.split('@')[0], // Use email prefix as name
              email: formData.email,
              role: mode === 'admin' ? 'admin' : 'user',
              registrationDate: new Date().toISOString(),
            });
            userProfile = { role: mode === 'admin' ? 'admin' : 'user' };
          }

          // Check admin access
          if (mode === 'admin' && userProfile.role !== 'admin') {
            alert('Access denied. Admin privileges required.');
            setIsLoading(false);
            await firebaseAuth.signOut();
            return;
          }

          // Set authentication state in localStorage for backward compatibility
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userEmail', formData.email);
          localStorage.setItem('userId', userId);

          // Set admin status in localStorage
          const isAdminUser = userProfile.role === 'admin';
          localStorage.setItem('isAdmin', isAdminUser ? 'true' : 'false');

          // Redirect based on user role
          if (isAdminUser) {
            window.location.href = '/admin';
          } else {
            window.location.href = '/dashboard';
          }
        } else {
          alert(`Sign in failed: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    // Check for signup validation
    if ((mode === 'signup' || mode === 'admin') && (!agreeTerms || !agreePrivacy)) {
      alert('Please agree to the Terms and Conditions and Privacy Policy to create an account.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await firebaseAuth.signInWithGoogle();
      if (result.success) {
        const user = result.user;
        const userId = user.uid;

        // Check if user profile exists, create if not
        const profileResult = await firebaseDB.getUserProfile(userId);
        let userProfile = null;
        if (profileResult.success) {
          userProfile = profileResult.data;
        } else {
          // Create new profile for Google user
          await firebaseDB.saveUserProfile(userId, {
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            role: mode === 'admin' ? 'admin' : 'user',
            registrationDate: new Date().toISOString(),
            avatarUrl: user.photoURL,
          });
          userProfile = { role: mode === 'admin' ? 'admin' : 'user' };
        }

        // For signup mode, don't auto-sign in
        if (mode === 'signup' || mode === 'admin') {
          alert('Account created successfully! Please sign in to continue.');
          setIsLoading(false);
          return;
        }

        // Set authentication state in localStorage for backward compatibility
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', userId);

        // Set admin status in localStorage
        const isAdminUser = userProfile.role === 'admin';
        localStorage.setItem('isAdmin', isAdminUser ? 'true' : 'false');

        // Redirect based on user role
        if (isAdminUser) {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        alert(`Google authentication failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Google auth error:', error);
      alert('Google authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-deep-dark flex items-center justify-center p-4">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(255, 26, 26, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 26, 26, 0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
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
            // Fallback to text logo if image fails to load
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

      {/* Main Login Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[280px] sm:max-w-sm lg:max-w-md bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-bright-red/30 rounded-2xl p-3 sm:p-6 shadow-2xl shadow-neon-red relative z-10 mt-16"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-transparent bg-gradient-to-r from-bright-red via-cyan-400 to-bright-red bg-clip-text mb-3 tracking-wide"
          >
            {mode === 'signin' ? 'Welcome Back' : mode === 'admin' ? 'Admin Portal' : 'Join TechnoSapiens'}
          </motion.h1>
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-300 text-sm sm:text-base font-medium"
          >
            {mode === 'signin' 
              ? 'Sign in to access your account' 
              : mode === 'admin'
              ? 'Administrator access portal'
              : 'Create your account to get started'
            }
          </motion.p>
        </div>

        {/* Google Sign In Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          onClick={handleGoogleAuth}
          disabled={(mode === 'signup' || mode === 'admin') && (!agreeTerms || !agreePrivacy)}
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors mb-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </motion.button>

        {/* Divider */}
        <div className="flex items-center mb-4">
          <div className="flex-1 border-t border-gray-600"></div>
          <span className="px-3 text-gray-400 text-xs">or</span>
          <div className="flex-1 border-t border-gray-600"></div>
        </div>

        {/* Form */}
        <motion.form 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          onSubmit={handleSubmit} 
          className="space-y-4"
        >
          {mode === 'signup' || mode === 'admin' ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bright-red focus:ring-1 focus:ring-bright-red/50 transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter your full name"
                required
              />
            </div>
          ) : null}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bright-red focus:ring-1 focus:ring-bright-red/50 transition-all duration-300 backdrop-blur-sm"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 pr-10 text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bright-red focus:ring-1 focus:ring-bright-red/50 transition-all duration-300 backdrop-blur-sm"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {mode === 'signup' || mode === 'admin' ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 pr-10 text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bright-red focus:ring-1 focus:ring-bright-red/50 transition-all duration-300 backdrop-blur-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showConfirmPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>
          ) : null}

          {mode === 'admin' ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Invite Code
              </label>
              <input
                type="text"
                name="inviteCode"
                value={formData.inviteCode}
                onChange={handleInputChange}
                className="w-full px-4 py-2 text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bright-red focus:ring-1 focus:ring-bright-red/50 transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter admin invite code"
                required
              />
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading || ((mode === 'signup' || mode === 'admin') && (!agreeTerms || !agreePrivacy))}
            className="w-full bg-gradient-to-r from-bright-red to-dark-red hover:from-dark-red hover:to-bright-red text-white font-bold py-3 px-4 text-sm rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-neon-red hover:shadow-neon-dark-red"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>

          {mode === 'signin' ? (
            <div className="text-right">
              <button
                type="button"
                className="text-bright-red hover:text-dark-red text-sm transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          ) : null}

          {mode === 'signup' || mode === 'admin' ? (
            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 text-bright-red focus:ring-bright-red"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-300">
                  I agree to the <button onClick={() => window.location.href = '/terms'} className="text-cyan-400 hover:text-bright-red underline">Terms and Conditions</button>
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agreePrivacy"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="mt-1 text-bright-red focus:ring-bright-red"
                />
                <label htmlFor="agreePrivacy" className="text-sm text-gray-300">
                  I agree to the <button onClick={() => window.location.href = '/privacy'} className="text-cyan-400 hover:text-bright-red underline">Privacy Policy</button>
                </label>
              </div>
            </div>
          ) : null}
        </motion.form>

        {/* Switch Mode */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-4"
        >
          <p className="text-gray-400 text-base">
            {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-cyan-400 hover:text-bright-red font-medium transition-colors"
            >
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </motion.div>

        {/* Admin Login */}
        {mode === 'signin' ? (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-center mt-4 pt-4 border-t border-gray-700"
          >
            <button
              onClick={() => setMode('admin')}
              className="text-bright-red hover:text-dark-red font-medium text-base transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Admin Login →
            </button>
          </motion.div>
        ) : null}

        {/* Notices */}
        {mode === 'signup' ? (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-6 p-4 bg-cyan-400/10 border border-cyan-400/30 rounded-xl"
          >
            <p className="text-cyan-400 text-sm text-center">
              📧 You'll receive an OTP via email to verify your account
            </p>
          </motion.div>
        ) : null}

        {mode === 'admin' ? (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-6 p-4 bg-bright-red/10 border border-bright-red/30 rounded-xl"
          >
            <p className="text-bright-red text-sm text-center">
              🔐 Admin access requires a valid invite code
            </p>
          </motion.div>
        ) : null}
      </motion.div>
    </div>
  )
}

export default LoginPage;
