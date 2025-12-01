import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Events from './components/Events';
import EventShop from './components/EventShop';
import ParticlesBackground from './components/ParticlesBackground';
import Footer from './components/Footer';
import Judges from './components/Judges';
import Schedule from './components/Schedule';
import Sponsors from './components/Sponsors';
import Faqs from './components/Faqs';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import LoadingScreen from './components/LoadingScreen';
import useLoadingScreen from './hooks/useLoadingScreen';
import { ShoppingCart, X, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FirebaseProvider } from './FirebaseContext';
import { firebaseDB } from './firebaseUtils';
import { getRedirectUrl, getCurrentPath } from './routingUtils';

export default function AppWithFirebase() {
  return (
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  );
}

function App() {
  // All hooks must be called before any conditional returns
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [showRegistrationCheck, setShowRegistrationCheck] = useState(false);
  const [showLoginNotification, setShowLoginNotification] = useState(false);
  const { isLoading } = useLoadingScreen();

  // Handle hash-based scrolling on page load
  useEffect(() => {
    try {
      const handleHashScroll = () => {
        const hash = window.location.hash;
        if (hash) {
          const elementId = hash.substring(1); // Remove the '#'
          const element = document.getElementById(elementId);
          if (element) {
            // Add a small delay to ensure components are rendered
            setTimeout(() => {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
          }
        }
      };

      // Handle initial load
      handleHashScroll();

      // Handle hash changes
      window.addEventListener('hashchange', handleHashScroll);

      return () => {
        window.removeEventListener('hashchange', handleHashScroll);
      };
    } catch (error) {
      console.error('Error in hash scroll handler:', error);
    }
  }, []);

  // Simple routing based on URL path
  const currentPath = typeof window !== 'undefined' ? getCurrentPath() : '/';

  // Check authentication and admin status for protected routes
  let isAuthenticated = false;
  let isAdmin = false;
  
  try {
    isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    isAdmin = localStorage.getItem('isAdmin') === 'true';
  } catch (error) {
    console.warn('localStorage access failed:', error);
  }

  // Route handling - all routing logic after hooks
  if (currentPath === '/login') {
    return <LoginPage />;
  }

  // Protected routes - redirect to login if not authenticated
  if (currentPath === '/dashboard' || currentPath === '/profile' || currentPath === '/edit-profile') {
    if (!isAuthenticated) {
      window.location.href = getRedirectUrl('/login');
      return null; // Prevent rendering while redirecting
    }
    // Redirect admins to admin panel if they try to access dashboard
    if (isAdmin && currentPath === '/dashboard') {
      window.location.href = getRedirectUrl('/admin');
      return null;
    }
  }

  // Admin-only routes - redirect to dashboard if not admin
  if (currentPath === '/admin') {
    if (!isAuthenticated) {
      window.location.href = getRedirectUrl('/login');
      return null;
    }
    if (!isAdmin) {
      window.location.href = getRedirectUrl('/dashboard');
      return null;
    }
    return <AdminPanel />;
  }

  if (currentPath === '/dashboard') {
    return <Dashboard />;
  }

  if (currentPath === '/profile') {
    return <Profile />;
  }

  if (currentPath === '/edit-profile') {
    return <EditProfile />;
  }

  if (currentPath === '/terms') {
    return <TermsAndConditions />;
  }

  if (currentPath === '/privacy') {
    return <PrivacyPolicy />;
  }

  const addToCart = (event) => {
    const existingItem = cart.find(item => item.id === event.id);
    if (existingItem) {
      // Already in cart - do nothing (max 1 ticket per event)
      return;
    } else {
      setCart([...cart, { ...event, quantity: 1 }]);
    }
  };

  const toggleCart = (event, userRegistrations = {}, participantCounts = {}) => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      setShowLoginNotification(true);
      return;
    }

    // Check if user is already registered for this event
    if (userRegistrations[event.id]) {
      // User is already registered, don't add to cart
      return;
    }

    // Check if event is inactive
    if (event.active === false) {
      // Event is inactive, don't add to cart
      return;
    }

    // Check if event is at full capacity
    const isAtCapacity = event.maxTickets && ((participantCounts[event.id] || 0) / event.maxTickets) >= 1;
    if (isAtCapacity) {
      // Event is at full capacity, don't add to cart
      alert('This event is at full capacity and cannot accept more registrations.');
      return;
    }

    const existingItem = cart.find(item => item.id === event.id);
    if (existingItem) {
      // Remove from cart
      setCart(cart.filter(item => item.id !== event.id));
    } else {
      // Add to cart
      setCart([...cart, { ...event, quantity: 1 }]);
    }
  };

  const removeFromCart = (eventId) => {
    setCart(cart.filter(item => item.id !== eventId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    // Show registration confirmation dialog
    setShowRegistrationCheck(true);
  };

  const confirmCheckout = async () => {
    try {
      setShowRegistrationCheck(false);
      setCheckoutSuccess(true);

      // Get user ID from localStorage
      const userId = localStorage.getItem('userId');
      if (userId && cart.length > 0) {
        const successfulRegistrations = [];
        const failedRegistrations = [];

        // Register user for each event in the cart
        for (const item of cart) {
          const registrationData = {
            eventId: item.id,
            eventName: item.title,
            eventDate: new Date().toISOString().split('T')[0], // Today's date as placeholder
            eventTime: 'TBD', // Placeholder
            venue: 'TBD', // Placeholder
            paymentId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            amount: item.price,
            quantity: item.quantity,
          };

          const result = await firebaseDB.registerForEvent(userId, item.id, registrationData);
          if (result.success) {
            console.log(`Successfully registered for event: ${item.title}`);
            successfulRegistrations.push(item);
          } else {
            console.error(`Failed to register for event: ${item.title}`, result.error);
            failedRegistrations.push({ item, error: result.error });
          }
        }

        // Update cart to only keep failed registrations (so user can retry)
        if (failedRegistrations.length > 0) {
          const failedIds = failedRegistrations.map(f => f.item.id);
          setCart(cart.filter(item => failedIds.includes(item.id)));
        } else {
          // All registrations successful, clear cart
          setCart([]);
        }

        // Show different success messages based on results
        if (successfulRegistrations.length > 0 && failedRegistrations.length === 0) {
          // All successful
          setTimeout(() => {
            setCheckoutSuccess(false);
            setIsCartOpen(false);
            // Redirect to dashboard to show registered events
            window.location.href = getRedirectUrl('/dashboard');
          }, 3000);
        } else if (successfulRegistrations.length > 0 && failedRegistrations.length > 0) {
          // Partial success - some events failed
          setTimeout(() => {
            setCheckoutSuccess(false);
            // Don't close cart, show failed events
            alert(`Some registrations failed:\n${failedRegistrations.map(f => `${f.item.title}: ${f.error}`).join('\n')}\n\nYou can retry the failed registrations.`);
          }, 3000);
        } else {
          // All failed
          setTimeout(() => {
            setCheckoutSuccess(false);
            alert(`All registrations failed:\n${failedRegistrations.map(f => `${f.item.title}: ${f.error}`).join('\n')}\n\nPlease try again or contact support.`);
          }, 3000);
        }
      } else {
        // No cart items or no user
        setTimeout(() => {
          setCheckoutSuccess(false);
          setCart([]);
          setIsCartOpen(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      // Show error message
      setTimeout(() => {
        setCheckoutSuccess(false);
        alert('An unexpected error occurred during checkout. Please try again.');
      }, 3000);
    }
  };

  const cancelCheckout = () => {
    setShowRegistrationCheck(false);
    setIsCartOpen(false);
  };

  return (
    <div className="App">
      {/* Loading Screen */}
      <LoadingScreen isLoading={isLoading} />
      
      {/* Main Content - Only show when not loading */}
      {!isLoading && (
        <>
          <ParticlesBackground />
          <Hero />
          <About />
          <Events />
          <EventShop cart={cart} addToCart={addToCart} toggleCart={toggleCart} />
          <Schedule />
          <Judges />
          <Sponsors />
          <Faqs />
          <Footer />

          {/* Global Shopping Cart Button */}
          <motion.div 
            className="fixed bottom-6 right-6 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => {
                const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
                if (!isAuthenticated) {
                  setShowLoginNotification(true);
                } else {
                  setIsCartOpen(true);
                }
              }}
              className="relative bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4 rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-110"
            >
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-bright-red text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                >
                  {getTotalItems()}
                </motion.span>
              )}
            </button>
          </motion.div>

          {/* Shopping Cart Sidebar */}
          <AnimatePresence>
            {isCartOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsCartOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                />

                {/* Cart Panel */}
                <motion.div
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '100%', opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed inset-x-0 bottom-0 top-20 md:top-6 md:right-6 md:left-auto md:bottom-6 md:w-full md:max-w-md bg-slate-900 rounded-t-2xl md:rounded-2xl shadow-2xl shadow-cyan-500/20 z-50 flex flex-col border-t border-slate-700 md:border"
                >
                  {/* Cart Header */}
                  <div className="p-4 md:p-6 border-b border-slate-800">
                    {/* Mobile drag handle */}
                    <div className="md:hidden w-12 h-1 bg-slate-600 rounded-full mx-auto mb-4"></div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl md:text-2xl font-bold text-white flex items-center gap-2 md:gap-3">
                        <ShoppingCart className="text-cyan-400 w-5 h-5 md:w-6 md:h-6" />
                        <span className="hidden sm:inline">Your Cart</span>
                        <span className="sm:hidden">Cart</span>
                      </h3>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <X size={20} className="text-gray-400 md:w-6 md:h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart size={64} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400">Your cart is empty</p>
                        <p className="text-sm text-gray-500 mt-2">Add some events to get started!</p>
                      </div>
                    ) : (
                      <div className="space-y-3 md:space-y-4">
                        {cart.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-slate-800/50 rounded-lg p-3 md:p-4 border border-slate-700"
                          >
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full sm:w-16 md:w-20 h-32 sm:h-16 md:h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-white text-sm mb-1 line-clamp-1">
                                  {item.title}
                                </h4>
                                <p className="text-cyan-400 font-bold text-sm md:text-base">₹{item.price}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-gray-400 text-xs">1 Ticket</span>
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-1 hover:bg-red-500/20 rounded transition-colors"
                                  >
                                    <Trash2 size={14} className="text-red-400 md:w-4 md:h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cart Footer */}
                  {cart.length > 0 && (
                    <div className="p-4 md:p-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-400 font-semibold text-sm md:text-base">Total ({getTotalItems()} items)</span>
                        <span className="text-2xl md:text-3xl font-bold text-white">₹{getTotalPrice()}</span>
                      </div>
                      
                      {checkoutSuccess ? (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-green-500 text-white py-4 rounded-lg flex items-center justify-center gap-2 font-semibold"
                        >
                          <Check size={24} />
                          Registration Successful!
                        </motion.div>
                      ) : showRegistrationCheck ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          <div className="bg-yellow-500/10 border-2 border-yellow-500/40 rounded-lg p-4 md:p-6">
                            <p className="text-yellow-400 font-semibold text-base md:text-lg mb-3">⚠️ Registration Confirmation</p>
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                              Have you registered yourself as a participant on the TechnoSapiens platform?
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            <button
                              onClick={confirmCheckout}
                              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 md:py-4 rounded-lg font-bold text-sm md:text-base hover:shadow-lg hover:shadow-green-500/50 transition-all hover:scale-105"
                            >
                              Yes, I'm Registered
                            </button>
                            <button
                              onClick={cancelCheckout}
                              className="flex-1 bg-slate-700 text-white py-3 md:py-4 rounded-lg font-bold text-sm md:text-base hover:bg-slate-600 transition-all hover:scale-105"
                            >
                              No, Cancel
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <button
                          onClick={() => {
                            const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
                            if (!isAuthenticated) {
                              setShowLoginNotification(true);
                            } else {
                              handleCheckout();
                            }
                          }}
                          className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105"
                        >
                          Proceed to Checkout
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Login Notification Popup */}
          <AnimatePresence>
            {showLoginNotification && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowLoginNotification(false)}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-cyan-500/20 max-w-md w-full p-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-bold text-white mb-2"
                  >
                    Login Required
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-300 mb-6 leading-relaxed"
                  >
                    You need to create an account or log in to purchase event tickets and access your dashboard.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <button
                      onClick={() => {
                        setShowLoginNotification(false);
                        window.location.href = getRedirectUrl('/login');
                      }}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3 px-4 rounded-lg font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105"
                    >
                      Go to Login
                    </button>
                    <button
                      onClick={() => setShowLoginNotification(false)}
                      className="flex-1 bg-slate-700 text-white py-3 px-4 rounded-lg font-bold hover:bg-slate-600 transition-all hover:scale-105"
                    >
                      Cancel
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}