import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import logo from '../images/logo.png';
import { firebaseDB } from '../firebaseUtils';
import AttendanceManagement from '../components/AttendanceManagement';

const AdminPanel = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventParticipantCounts, setEventParticipantCounts] = useState({});
  const [activeSection, setActiveSection] = useState('events');
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [banStatusFilter, setBanStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banAction, setBanAction] = useState('ban'); // 'ban' or 'unban'
  const [selectedEventForBan, setSelectedEventForBan] = useState(''); // For event-specific bans
  const [eventBanActions, setEventBanActions] = useState({ canBanFromEvent: false, canUnbanFromEvent: false, mixedBanStatus: false });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    price: '',
    category: '',
    duration: '',
    prize: '',
    image: '',
    maxTickets: '',
    active: true,
  });

  const loadEvents = useCallback(async () => {
    try {
      const result = await firebaseDB.getAllEventsAdmin();
      if (result.success) {
        setEvents(result.data);
        // Load participant counts for all events
        loadAllParticipantCounts(result.data);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update event ban actions when selection or event changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const updateEventBanActions = async () => {
      if (selectedUsers.length > 0 && selectedEventForBan) {
        const actions = await getEventBanActions();
        setEventBanActions(actions);
      } else {
        setEventBanActions({ canBanFromEvent: false, canUnbanFromEvent: false, mixedBanStatus: false });
      }
    };

    updateEventBanActions();
  }, [selectedUsers, selectedEventForBan]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const result = await firebaseDB.getAllUsers();
      if (result.success) {
        setUsers(result.data);
        setFilteredUsers(result.data);
      } else {
        console.error('Error loading users:', result.error);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    if (activeSection === 'users') {
      loadUsers();
    }
  }, [activeSection]);

  // Filter users based on search term and event filter
  useEffect(() => {
    let filtered = users;

    // Filter by search term (name)
    if (searchTerm.trim()) {
      filtered = filtered.filter(user => 
        user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    }

    // Filter by event
    if (eventFilter !== 'all') {
      filtered = filtered.filter(user => 
        user.registeredEvents && 
        user.registeredEvents.some(event => event.eventId === eventFilter)
      );
    }

    // Filter by ban status
    if (banStatusFilter !== 'all') {
      filtered = filtered.filter(user => 
        banStatusFilter === 'banned' ? user.banned : !user.banned
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, eventFilter, banStatusFilter]);

  // Toggle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Select all visible users
  const selectAllUsers = () => {
    const visibleUserIds = filteredUsers.map(user => user.userId);
    setSelectedUsers(visibleUserIds);
  };

  // Select only banned users
  const selectBannedUsers = () => {
    const bannedUserIds = filteredUsers.filter(user => user.banned).map(user => user.userId);
    setSelectedUsers(bannedUserIds);
  };

  // Select only unbanned users
  const selectUnbannedUsers = () => {
    const unbannedUserIds = filteredUsers.filter(user => !user.banned).map(user => user.userId);
    setSelectedUsers(unbannedUserIds);
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedUsers([]);
  };

  // Handle ban/unban action
  const handleBanAction = (action) => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user to perform this action.');
      return;
    }
    
    // Check if the action is valid for the selected users
    const selectedUsersData = filteredUsers.filter(user => selectedUsers.includes(user.userId));
    const hasBannedUsers = selectedUsersData.some(user => user.banned);
    const hasUnbannedUsers = selectedUsersData.some(user => !user.banned);
    
    if (action === 'ban' && hasBannedUsers) {
      alert('Cannot ban users who are already banned. Please select only unbanned users.');
      return;
    }
    
    if (action === 'unban' && hasUnbannedUsers) {
      alert('Cannot unban users who are not banned. Please select only banned users.');
      return;
    }
    
    setBanAction(action);
    setShowBanModal(true);
  };

  // Handle event-specific ban/unban action
  const handleEventBanAction = (action) => {
    if (selectedUsers.length === 0) {
      return;
    }
    
    if (!selectedEventForBan) {
      return;
    }

    // Set the ban action and show the modal
    setBanAction(action);
    setShowBanModal(true);
  };

  // Get available event-specific actions based on selected users and event
  const getEventBanActions = useCallback(async () => {
    if (selectedUsers.length === 0 || !selectedEventForBan) {
      return { canBanFromEvent: false, canUnbanFromEvent: false };
    }

    try {
      const results = await Promise.all(
        selectedUsers.map(userId => 
          firebaseDB.isUserBannedFromEvent(userId, selectedEventForBan)
        )
      );

      const bannedCount = results.filter(result => result.success && result.banned).length;
      const unbannedCount = results.filter(result => result.success && !result.banned).length;

      return {
        canBanFromEvent: unbannedCount > 0 && bannedCount === 0, // Can only ban if none are banned
        canUnbanFromEvent: bannedCount > 0 && unbannedCount === 0, // Can only unban if all are banned
        mixedBanStatus: bannedCount > 0 && unbannedCount > 0 // Mixed status - show neither button
      };
    } catch (error) {
      console.error('Error checking event ban status:', error);
      return { canBanFromEvent: false, canUnbanFromEvent: false, mixedBanStatus: false };
    }
  }, [selectedUsers, selectedEventForBan]);

  // Get appropriate action based on selected users
  const getAvailableActions = () => {
    if (selectedUsers.length === 0) return { canBan: false, canUnban: false };
    
    const selectedUsersData = filteredUsers.filter(user => selectedUsers.includes(user.userId));
    const hasBannedUsers = selectedUsersData.some(user => user.banned);
    const hasUnbannedUsers = selectedUsersData.some(user => !user.banned);
    
    return {
      canBan: hasUnbannedUsers && !hasBannedUsers, // Can only ban if all selected are unbanned
      canUnban: hasBannedUsers && !hasUnbannedUsers // Can only unban if all selected are banned
    };
  };

  // Execute ban/unban
  const executeBanAction = async () => {
    try {
      let result;
      
      if (selectedEventForBan) {
        // Event-specific ban/unban
        const results = await Promise.all(
          selectedUsers.map(userId => 
            firebaseDB.banUserFromEvent(userId, selectedEventForBan, banAction === 'ban')
          )
        );
        
        const failed = results.filter(res => !res.success);
        if (failed.length > 0) {
          console.error(`Failed to ${banAction} ${failed.length} users from event`);
        }
        
        result = { success: true };
      } else {
        // Global ban/unban
        result = await firebaseDB.banMultipleUsers(selectedUsers, banAction === 'ban');
      }
      
      if (result.success) {
        // Refresh users list
        await loadUsers();
        // Clear selections
        setSelectedUsers([]);
        setShowBanModal(false);
        // Clear event selection for event-specific bans
        if (selectedEventForBan) {
          setSelectedEventForBan('');
        }
      } else {
        console.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error executing ban action:', error);
    }
  };

  const loadAllParticipantCounts = async (eventsList) => {
    const counts = {};
    for (const event of eventsList) {
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
    setEventParticipantCounts(counts);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
        price: parseFloat(formData.price),
        category: formData.category,
        duration: formData.duration,
        prize: formData.prize,
        image: formData.image,
        maxTickets: parseInt(formData.maxTickets),
      };

      if (editingEvent) {
        await firebaseDB.updateEvent(editingEvent.id, eventData);
      } else {
        await firebaseDB.createEvent(eventData);
      }

      setFormData({
        title: '',
        description: '',
        icon: '',
        price: '',
        category: '',
        duration: '',
        prize: '',
        image: '',
        maxTickets: '',
        active: true,
      });
      setEditingEvent(null);
      setShowCreateForm(false);
      loadEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      icon: event.icon || '',
      price: event.price || '',
      category: event.category || '',
      duration: event.duration || '',
      prize: event.prize || '',
      image: event.image || '',
      maxTickets: event.maxTickets || '',
      active: event.active !== false,
    });
    setShowCreateForm(true);
  };

  const handleToggleStatus = async (eventId, currentStatus) => {
    try {
      await firebaseDB.toggleEventStatus(eventId, !currentStatus);
      loadEvents();
    } catch (error) {
      console.error('Error toggling event status:', error);
    }
  };

  const goHome = () => {
    window.location.href = '/';
  };

  const goDashboard = () => {
    window.location.href = '/dashboard';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-bright-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
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
            <div className="flex items-center space-x-4">
              <button
                onClick={goHome}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Home</span>
              </button>

              <div className="flex items-center space-x-3">
                <img
                  src={logo}
                  alt="TechnoSapiens Logo"
                  className="w-12 h-12 object-contain rounded-full"
                  style={{
                    clipPath: 'circle(50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: '2px'
                  }}
                />
                <span className="hidden sm:inline font-display text-lg tracking-widest text-bright-red uppercase">
                  TECHNO<span className="text-gray-200">SAPIENS</span>
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={goDashboard}
                className="px-4 py-2 text-sm font-bold uppercase text-bright-red bg-transparent border border-bright-red rounded-full hover:bg-bright-red/10 hover:shadow-neon-red transition-all duration-300"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 xl:px-12 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-transparent bg-gradient-to-r from-bright-red via-cyan-400 to-bright-red bg-clip-text mb-4 leading-tight"
            >
              Admin Panel
            </motion.h1>
            <div className="w-24 lg:w-32 h-1 bg-gradient-to-r from-bright-red to-cyan-400 rounded-full mx-auto mb-6"></div>
            <p className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">
              Manage events, control visibility, and monitor registrations.
            </p>
          </div>

          {/* Section Toggle Buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
            <button
              onClick={() => setActiveSection('events')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold uppercase rounded-full transition-all duration-300 ${
                activeSection === 'events'
                  ? 'bg-gradient-to-r from-bright-red to-dark-red text-white shadow-neon-red'
                  : 'bg-gray-800 text-gray-400 border border-gray-600 hover:bg-gray-700'
              }`}
            >
              Manage Events
            </button>
            <button
              onClick={() => setActiveSection('users')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold uppercase rounded-full transition-all duration-300 ${
                activeSection === 'users'
                  ? 'bg-gradient-to-r from-bright-red to-dark-red text-white shadow-neon-red'
                  : 'bg-gray-800 text-gray-400 border border-gray-600 hover:bg-gray-700'
              }`}
            >
              Manage Users
            </button>
            <button
              onClick={() => setActiveSection('attendance')}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold uppercase rounded-full transition-all duration-300 ${
                activeSection === 'attendance'
                  ? 'bg-gradient-to-r from-bright-red to-dark-red text-white shadow-neon-red'
                  : 'bg-gray-800 text-gray-400 border border-gray-600 hover:bg-gray-700'
              }`}
            >
              Attendance
            </button>
          </div>

          {/* Create/Edit Event Form */}
          {showCreateForm && activeSection === 'events' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-bright-red/40 rounded-3xl p-8 shadow-2xl shadow-bright-red/20"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-6">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bright-red"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-bright-red"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Business">Business</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Technology">Technology</option>
                    <option value="Design">Design</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Creative">Creative</option>
                    <option value="Adventure">Adventure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bright-red"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 2 Days"
                    className="w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bright-red"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="e.g., 🦈"
                    className="w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bright-red"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Tickets</label>
                  <input
                    type="number"
                    value={formData.maxTickets}
                    onChange={(e) => setFormData({ ...formData, maxTickets: e.target.value })}
                    className="w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bright-red"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bright-red"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Prize</label>
                  <input
                    type="text"
                    value={formData.prize}
                    onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                    placeholder="e.g., ₹50,000 Prize Pool"
                    className="w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bright-red"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bright-red"
                    required
                  />
                </div>

                <div className="md:col-span-2 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-bright-red to-dark-red hover:from-dark-red hover:to-bright-red text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-neon-red hover:shadow-neon-dark-red"
                  >
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingEvent(null);
                      setFormData({
                        title: '',
                        description: '',
                        icon: '',
                        price: '',
                        category: '',
                        duration: '',
                        prize: '',
                        image: '',
                        maxTickets: '',
                        active: true,
                      });
                    }}
                    className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Events List */}
          {activeSection === 'events' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-white">Manage Events ({events.length})</h2>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="px-3 py-1.5 text-sm font-bold uppercase bg-gradient-to-r from-bright-red to-dark-red hover:from-dark-red hover:to-bright-red text-white rounded-full hover:shadow-neon-red transition-all duration-300"
                >
                  {showCreateForm ? 'Cancel' : '+ Add Event'}
                </button>
              </div>

            {events.length === 0 ? (
              <div className="text-center py-12 bg-gray-900/50 rounded-2xl border border-gray-700">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Events Created</h3>
                <p className="text-gray-400 mb-6">Create your first event to get started!</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-bright-red to-dark-red hover:from-dark-red hover:to-bright-red text-white font-bold rounded-xl transition-all duration-300 shadow-neon-red hover:shadow-neon-dark-red"
                >
                  Create First Event
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-bright-red/50 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{event.icon}</span>
                        <div>
                          <h3 className="font-bold text-white text-lg">{event.title}</h3>
                          <p className="text-gray-400 text-sm">{event.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                          event.active !== false
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {event.active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>₹{event.price}</span>
                      <span>{event.duration}</span>
                      <span>Registered: {eventParticipantCounts[event.id] || 0}/{event.maxTickets || '∞'}</span>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>Capacity</span>
                        <span>{event.maxTickets ? Math.round(((eventParticipantCounts[event.id] || 0) / event.maxTickets) * 100) : 0}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            event.maxTickets && ((eventParticipantCounts[event.id] || 0) / event.maxTickets) >= 0.9
                              ? 'bg-red-500'
                              : event.maxTickets && ((eventParticipantCounts[event.id] || 0) / event.maxTickets) >= 0.7
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{
                            width: event.maxTickets ? `${Math.min(((eventParticipantCounts[event.id] || 0) / event.maxTickets) * 100, 100)}%` : '0%'
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="flex-1 px-3 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(event.id, event.active !== false)}
                        className={`flex-1 px-3 py-2 border rounded-lg transition-colors text-sm ${
                          event.active !== false
                            ? 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'
                            : 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'
                        }`}
                      >
                        {event.active !== false ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            </div>
          )}

          {/* Manage Users Section */}
          {activeSection === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-white">Manage Users ({filteredUsers.length})</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={loadUsers}
                    disabled={loadingUsers}
                    className="px-4 py-2 text-sm font-bold uppercase bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-full hover:shadow-neon-cyan transition-all duration-300 disabled:opacity-50"
                  >
                    {loadingUsers ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
              </div>

              {/* Search and Filter Controls */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Search Bar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Search by Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter user name..."
                        className="w-full px-2 sm:px-4 py-2 sm:py-3 pl-8 sm:pl-10 text-xs sm:text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                      />
                      <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Event Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Event</label>
                    <select
                      value={eventFilter}
                      onChange={(e) => setEventFilter(e.target.value)}
                      className="w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="all">All Events</option>
                      {events.map(event => (
                        <option key={event.id} value={event.id}>{event.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Ban Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Status</label>
                    <select
                      value={banStatusFilter}
                      onChange={(e) => setBanStatusFilter(e.target.value)}
                      className="w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="all">All Users</option>
                      <option value="normal">Normal Users</option>
                      <option value="banned">Banned Users</option>
                    </select>
                  </div>
                </div>

                {/* Active Filters Display */}
                {(searchTerm.trim() || eventFilter !== 'all' || banStatusFilter !== 'all') && (
                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-400">Active filters:</span>
                    {searchTerm.trim() && (
                      <span className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-400 rounded-full">
                        Name: "{searchTerm}"
                      </span>
                    )}
                    {eventFilter !== 'all' && (
                      <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                        Event: {events.find(e => e.id === eventFilter)?.title || 'Unknown'}
                      </span>
                    )}
                    {banStatusFilter !== 'all' && (
                      <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full">
                        Status: {banStatusFilter === 'banned' ? 'Banned Users' : 'Normal Users'}
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setEventFilter('all');
                        setBanStatusFilter('all');
                      }}
                      className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>

              {/* Bulk Action Controls */}
              {selectedUsers.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <span className="text-white font-medium">
                        {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={selectAllUsers}
                          className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Select All ({filteredUsers.length})
                        </button>
                        <button
                          onClick={selectBannedUsers}
                          className="px-2 py-1 text-xs bg-red-700 text-red-300 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Select Banned ({filteredUsers.filter(user => user.banned).length})
                        </button>
                        <button
                          onClick={selectUnbannedUsers}
                          className="px-2 py-1 text-xs bg-green-700 text-green-300 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Select Unbanned ({filteredUsers.filter(user => !user.banned).length})
                        </button>
                        <button
                          onClick={clearSelections}
                          className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Clear Selection
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {/* Event-specific ban controls */}
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedEventForBan}
                          onChange={(e) => setSelectedEventForBan(e.target.value)}
                          className="px-2 py-1 text-xs bg-gray-800/50 border border-gray-600 rounded text-white focus:outline-none focus:border-cyan-500"
                        >
                          <option value="">Select Event</option>
                          {events.map(event => (
                            <option key={event.id} value={event.id}>{event.title}</option>
                          ))}
                        </select>
                        {selectedEventForBan && (
                          <>
                            {eventBanActions.canBanFromEvent && (
                              <button
                                onClick={() => handleEventBanAction('ban')}
                                className="px-3 py-2 text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all duration-300"
                              >
                                🚫 Ban from Event
                              </button>
                            )}
                            {eventBanActions.canUnbanFromEvent && (
                              <button
                                onClick={() => handleEventBanAction('unban')}
                                className="px-3 py-2 text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all duration-300"
                              >
                                ✅ Unban from Event
                              </button>
                            )}
                            {eventBanActions.mixedBanStatus && (
                              <span className="px-3 py-2 text-xs text-gray-400 bg-gray-800 rounded-lg">
                                Mixed ban status - Select users with same event ban status
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      
                      {/* Global ban controls */}
                      {(() => {
                        const { canBan, canUnban } = getAvailableActions();
                        return (
                          <>
                            {canUnban && (
                              <button
                                onClick={() => handleBanAction('unban')}
                                className="px-3 py-2 text-xs sm:text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg hover:shadow-neon-green transition-all duration-300"
                              >
                                🛡️ Unban Selected
                              </button>
                            )}
                            {canBan && (
                              <span className="px-3 py-2 text-xs text-gray-400 bg-gray-800 rounded-lg">
                                Use event-specific ban options above
                              </span>
                            )}
                            {!canBan && !canUnban && (
                              <span className="px-3 py-2 text-xs text-gray-400 bg-gray-800 rounded-lg">
                                Mixed selection - Select users with same status
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {loadingUsers ? (
                <div className="text-center py-12 bg-gray-900/50 rounded-2xl border border-gray-700">
                  <div className="w-12 h-12 border-4 border-b-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-300">Loading users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 bg-gray-900/50 rounded-2xl border border-gray-700">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    {users.length === 0 ? 'No Users Found' : 'No Matching Users'}
                  </h3>
                  <p className="text-gray-400">
                    {users.length === 0 
                      ? 'No users have registered yet.' 
                      : 'No users match your search criteria. Try adjusting your filters.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <motion.div
                      key={user.userId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border rounded-2xl p-4 sm:p-6 transition-all duration-300 ${
                        user.banned 
                          ? 'border-red-500/50 bg-red-900/20' 
                          : 'border-gray-700 hover:border-cyan-500/50'
                      } ${selectedUsers.includes(user.userId) ? 'ring-2 ring-cyan-500' : ''}`}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Checkbox */}
                        <div className="pt-1">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.userId)}
                            onChange={() => toggleUserSelection(user.userId)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                            {/* User Profile Info */}
                            <div className="xl:col-span-1">
                              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                                  user.banned 
                                    ? 'bg-gradient-to-br from-red-500 to-pink-500' 
                                    : 'bg-gradient-to-br from-cyan-500 to-blue-500'
                                }`}>
                                  <span className="text-white font-bold text-sm sm:text-lg">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                    <h3 className="font-bold text-white text-sm sm:text-lg truncate">{user.name || 'N/A'}</h3>
                                    {user.banned && (
                                      <span className="px-1.5 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full font-bold whitespace-nowrap">
                                        BANNED
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-400 text-xs truncate">User ID: {user.userId}</p>
                                </div>
                              </div>
                              
                              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  <span className="text-gray-300 truncate">{user.email || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  <span className="text-gray-300">{user.phone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                  <span className="text-gray-300 truncate">{user.college || 'N/A'}</span>
                                </div>
                                {user.banned && user.bannedAt && (
                                  <div className="flex items-center gap-1.5 sm:gap-2 text-red-400">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-xs">Banned on {new Date(user.bannedAt).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Event Registrations */}
                            <div className="xl:col-span-2">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                <h4 className="font-semibold text-white text-sm sm:text-base">Event Registrations ({user.totalEvents})</h4>
                                <span className="text-xs text-gray-400">
                                  Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                              
                              {user.registeredEvents && user.registeredEvents.length > 0 ? (
                                <div className="space-y-1.5 sm:space-y-2 max-h-32 sm:max-h-48 overflow-y-auto">
                                  {user.registeredEvents.map((event, index) => (
                                    <div
                                      key={`${event.eventId}-${index}`}
                                      className="bg-gray-800/50 border border-gray-600 rounded-lg p-2 sm:p-3"
                                    >
                                      <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                          <span className="font-medium text-white text-xs sm:text-sm truncate">{event.eventTitle}</span>
                                          <span className="px-1.5 py-0.5 text-xs bg-cyan-500/20 text-cyan-400 rounded-full whitespace-nowrap">
                                            {event.eventCategory}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-400">
                                          <span className="text-xs">Registered: {new Date(event.registeredAt).toLocaleDateString()}</span>
                                          <span className={`px-1.5 py-0.5 rounded-full text-xs whitespace-nowrap ${
                                            event.attended 
                                              ? 'bg-green-500/20 text-green-400' 
                                              : 'bg-yellow-500/20 text-yellow-400'
                                          }`}>
                                            {event.attended ? 'Attended' : 'Not Attended'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-3 sm:py-6 bg-gray-800/30 rounded-lg border border-gray-600">
                                  <p className="text-gray-400 text-xs sm:text-sm">No event registrations</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Attendance Management Section */}
          {activeSection === 'attendance' && (
            <AttendanceManagement />
          )}

        </motion.div>
      </div>

      {/* Ban/Unban Confirmation Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-2xl max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedEventForBan 
                  ? (banAction === 'ban' ? '🚫 Ban from Event' : '✅ Unban from Event')
                  : (banAction === 'ban' ? '⚔️ Ban Users' : '🛡️ Unban Users')
                }
              </h2>
              <button
                onClick={() => setShowBanModal(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Are you sure you want to {banAction} {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''}?
                {selectedEventForBan && (
                  <> from <strong>"{events.find(e => e.id === selectedEventForBan)?.title || 'Unknown Event'}"</strong></>
                )}
              </p>
              {selectedEventForBan ? (
                <div className={`border rounded-lg p-4 ${
                  banAction === 'ban' 
                    ? 'bg-orange-900/20 border-orange-500/50' 
                    : 'bg-blue-900/20 border-blue-500/50'
                }`}>
                  <p className={`text-sm ${
                    banAction === 'ban' ? 'text-orange-400' : 'text-blue-400'
                  }`}>
                    <strong>{banAction === 'ban' ? 'Event Ban:' : 'Event Unban:'}</strong> 
                    {banAction === 'ban' 
                      ? ' Users will lose access to this specific event only. They can still access other events.'
                      : ' Users will regain access to this specific event.'
                    }
                  </p>
                </div>
              ) : banAction === 'ban' ? (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 text-sm">
                    <strong>Warning:</strong> Banned users will lose access to their account and all event registrations. This action can be reversed later.
                  </p>
                </div>
              ) : (
                <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4">
                  <p className="text-green-400 text-sm">
                    <strong>Note:</strong> Unbanned users will regain access to their account and previous event registrations.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={executeBanAction}
                className={`flex-1 py-3 font-bold text-white rounded-lg transition-all duration-300 ${
                  selectedEventForBan
                    ? (banAction === 'ban'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                      )
                    : (banAction === 'ban'
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-neon-red'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-neon-green'
                      )
                }`}
              >
                {selectedEventForBan 
                  ? (banAction === 'ban' ? 'Ban from Event' : 'Unban from Event')
                  : (banAction === 'ban' ? 'Ban Users' : 'Unban Users')
                }
              </button>
              <button
                onClick={() => setShowBanModal(false)}
                className="flex-1 py-3 bg-gray-700 text-gray-300 font-bold rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
