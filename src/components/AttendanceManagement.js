import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { firebaseDB } from '../firebaseUtils';

const AttendanceManagement = () => {
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [filteredAttendees, setFilteredAttendees] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState('all'); // 'all', 'attended', 'not-attended'
  const [loading, setLoading] = useState(true);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);

  // Load events
  const loadEvents = useCallback(async () => {
    try {
      const result = await firebaseDB.getAllEventsAdmin();
      if (result.success) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load attendees for selected event
  const loadAttendees = useCallback(async (eventId) => {
    if (!eventId) return;
    
    setLoadingAttendees(true);
    try {
      // Get attendees for the event
      const attendeesResult = await firebaseDB.getEventAttendees(eventId);
      if (attendeesResult.success) {
        const attendeesData = attendeesResult.data;
        
        // Get user details for each attendee
        const attendeesWithDetails = await Promise.all(
          attendeesData.map(async (attendee) => {
            const userResult = await firebaseDB.getUserProfile(attendee.userId);
            const eventBanResult = await firebaseDB.isUserBannedFromEvent(attendee.userId, eventId);
            
            if (userResult.success) {
              return {
                ...attendee,
                userDetails: userResult.data,
                bannedFromEvent: eventBanResult.success ? eventBanResult.banned : false,
                eventBanData: eventBanResult.success ? eventBanResult : null
              };
            }
            return attendee;
          })
        );
        
        setAttendees(attendeesWithDetails);
        setFilteredAttendees(attendeesWithDetails);
        
        // Load attendance stats
        const statsResult = await firebaseDB.getEventAttendanceStats(eventId);
        if (statsResult.success) {
          setAttendanceStats(statsResult.data);
        }
      }
    } catch (error) {
      console.error('Error loading attendees:', error);
    } finally {
      setLoadingAttendees(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    if (selectedEvent) {
      loadAttendees(selectedEvent);
    } else {
      setAttendees([]);
      setFilteredAttendees([]);
      setAttendanceStats(null);
    }
  }, [selectedEvent, loadAttendees]);

  // Filter attendees based on search term and attendance filter
  useEffect(() => {
    let filtered = attendees;

    // Filter by search term (name or email)
    if (searchTerm.trim()) {
      filtered = filtered.filter(attendee => 
        attendee.userDetails && (
          (attendee.userDetails.name && attendee.userDetails.name.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
          (attendee.userDetails.email && attendee.userDetails.email.toLowerCase().includes(searchTerm.toLowerCase().trim()))
        )
      );
    }

    // Filter by attendance status
    if (attendanceFilter !== 'all') {
      filtered = filtered.filter(attendee => 
        attendanceFilter === 'attended' ? attendee.attended : !attendee.attended
      );
    }

    setFilteredAttendees(filtered);
  }, [attendees, searchTerm, attendanceFilter]);

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
    const visibleUserIds = filteredAttendees.map(attendee => attendee.userId);
    setSelectedUsers(visibleUserIds);
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedUsers([]);
  };

  // Mark attendance for selected users
  const markAttendanceForSelected = async (attended) => {
    if (selectedUsers.length === 0) {
      return;
    }

    // Filter out banned users from the selection
    const eligibleUsers = selectedUsers.filter(userId => {
      const attendee = attendees.find(a => a.userId === userId);
      return attendee && !attendee.bannedFromEvent;
    });

    if (eligibleUsers.length === 0) {
      return; // No eligible users to mark
    }

    try {
      const attendances = eligibleUsers.map(userId => ({
        userId,
        eventId: selectedEvent,
        attended
      }));

      const result = await firebaseDB.markMultipleAttendance(attendances);
      
      if (result.success) {
        // Refresh attendees list
        loadAttendees();
        // Clear selections
        setSelectedUsers([]);
      } else {
        console.error('Error marking attendance:', result.error);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  // Toggle attendance for a single user
  const toggleUserAttendance = async (userId, currentStatus) => {
    try {
      const result = await firebaseDB.markAttendance(userId, selectedEvent, !currentStatus);
      if (result.success) {
        // Reload attendees
        await loadAttendees(selectedEvent);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error toggling attendance:', error);
      alert('An error occurred while updating attendance.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-bright-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading attendance management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-dark text-gray-300">
      {/* Header */}
      <div className="bg-gray-900/90 backdrop-blur-xl border-b border-bright-red/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-display font-bold text-white">Attendance Management</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Event Selection */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Event</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-bright-red"
            >
              <option value="">Choose an event to manage attendance</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title} ({event.category}) - {event.price ? `₹${event.price}` : 'Free'}
                </option>
              ))}
            </select>
          </div>

          {selectedEvent && (
            <>
              {/* Attendance Statistics */}
              {attendanceStats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-bright-red">{attendanceStats.totalRegistered}</div>
                      <div className="text-sm text-gray-400">Total Registered</div>
                    </div>
                  </div>
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{attendanceStats.attended}</div>
                      <div className="text-sm text-gray-400">Attended</div>
                    </div>
                  </div>
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{attendanceStats.notAttended}</div>
                      <div className="text-sm text-gray-400">Not Attended</div>
                    </div>
                  </div>
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">{attendanceStats.attendanceRate}%</div>
                      <div className="text-sm text-gray-400">Attendance Rate</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Search and Filter Controls */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-2 sm:p-4 mb-6">
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                  {/* Search Bar */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Search</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Name or email..."
                        className="w-full px-2 py-1.5 pl-7 sm:px-3 sm:py-2 sm:pl-9 text-xs sm:text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                      />
                      <svg className="absolute left-2 top-2 sm:left-3 sm:top-2.5 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Attendance Filter */}
                  <div className="min-w-[120px]">
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Filter</label>
                    <select
                      value={attendanceFilter}
                      onChange={(e) => setAttendanceFilter(e.target.value)}
                      className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="all">All</option>
                      <option value="attended">Attended</option>
                      <option value="not-attended">Absent</option>
                    </select>
                  </div>
                </div>

                {/* Active Filters Display */}
                {(searchTerm.trim() || attendanceFilter !== 'all') && (
                  <div className="mt-2 sm:mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-400">Filters:</span>
                    {searchTerm.trim() && (
                      <span className="px-1.5 py-0.5 text-xs bg-cyan-500/20 text-cyan-400 rounded-full">
                        "{searchTerm.length > 10 ? searchTerm.substring(0, 10) + '...' : searchTerm}"
                      </span>
                    )}
                    {attendanceFilter !== 'all' && (
                      <span className="px-1.5 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                        {attendanceFilter === 'attended' ? 'Attended' : 'Absent'}
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setAttendanceFilter('all');
                      }}
                      className="px-1.5 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Bulk Action Controls */}
              {selectedUsers.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-2 sm:p-4 mb-6">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    {/* Selection Info */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-white font-medium text-xs sm:text-base whitespace-nowrap">
                        {selectedUsers.length} selected
                      </span>
                      <div className="flex gap-1 sm:gap-2">
                        <button
                          onClick={selectAllUsers}
                          className="px-1.5 py-1 text-xs bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors whitespace-nowrap"
                        >
                          All
                        </button>
                        <button
                          onClick={clearSelections}
                          className="px-1.5 py-1 text-xs bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors whitespace-nowrap"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      {/* Check if any selected users are banned from event */}
                      {(() => {
                        const selectedBannedUsers = filteredAttendees.filter(attendee => 
                          selectedUsers.includes(attendee.userId) && attendee.bannedFromEvent
                        );
                        const hasBannedUsers = selectedBannedUsers.length > 0;
                        const hasNonBannedUsers = selectedUsers.length > selectedBannedUsers.length;
                        
                        return (
                          <>
                            {/* Mark as Attended - Only for non-banned users */}
                            <button
                              onClick={() => markAttendanceForSelected(true)}
                              disabled={!hasNonBannedUsers}
                              className={`px-2 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-1 ${
                                hasNonBannedUsers
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              }`}
                              title={hasBannedUsers && !hasNonBannedUsers ? 'All selected users are banned from this event' : 'Mark selected as attended'}
                            >
                              <span className="text-sm">✓</span>
                              <span className="hidden sm:inline">Attend</span>
                            </button>
                            
                            {/* Mark as Not Attended - Only for non-banned users */}
                            <button
                              onClick={() => markAttendanceForSelected(false)}
                              disabled={!hasNonBannedUsers}
                              className={`px-2 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-1 ${
                                hasNonBannedUsers
                                  ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              }`}
                              title={hasBannedUsers && !hasNonBannedUsers ? 'All selected users are banned from this event' : 'Mark selected as not attended'}
                            >
                              <span className="text-sm">✗</span>
                              <span className="hidden sm:inline">Absent</span>
                            </button>
                            
                            {/* Warning for banned users */}
                            {hasBannedUsers && (
                              <span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center gap-1 whitespace-nowrap">
                                <span>⚠️</span>
                                <span className="hidden sm:inline">
                                  {selectedBannedUsers.length} banned excluded
                                </span>
                                <span className="sm:hidden">
                                  {selectedBannedUsers.length} banned
                                </span>
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* Attendees List */}
              {loadingAttendees ? (
                <div className="text-center py-12 bg-gray-900/50 rounded-2xl border border-gray-700">
                  <div className="w-12 h-12 border-4 border-b-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-300">Loading attendees...</p>
                </div>
              ) : filteredAttendees.length === 0 ? (
                <div className="text-center py-12 bg-gray-900/50 rounded-2xl border border-gray-700">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    {attendees.length === 0 ? 'No Attendees Found' : 'No Matching Attendees'}
                  </h3>
                  <p className="text-gray-400">
                    {attendees.length === 0 
                      ? 'No one has registered for this event yet.' 
                      : 'No attendees match your search criteria. Try adjusting your filters.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAttendees.map((attendee) => (
                    <motion.div
                      key={attendee.userId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border rounded-2xl p-4 transition-all duration-300 ${
                        attendee.bannedFromEvent 
                          ? 'border-red-500/50 bg-red-900/20' 
                          : attendee.attended 
                            ? 'border-green-500/50 bg-green-900/20' 
                            : 'border-gray-700 hover:border-cyan-500/50'
                      } ${selectedUsers.includes(attendee.userId) ? 'ring-2 ring-cyan-500' : ''}`}
                    >
                      <div className="flex items-center gap-2 sm:gap-4">
                        {/* Checkbox */}
                        <div className="pt-1 flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(attendee.userId)}
                            onChange={() => toggleUserSelection(attendee.userId)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2"
                          />
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                              <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                attendee.bannedFromEvent
                                  ? 'bg-gradient-to-br from-red-500 to-pink-500'
                                  : attendee.attended 
                                    ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                                    : 'bg-gradient-to-br from-cyan-500 to-blue-500'
                              }`}>
                                <span className="text-white font-bold text-xs sm:text-lg">
                                  {attendee.userDetails?.name ? attendee.userDetails.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1 sm:gap-2">
                                  <h3 className="font-bold text-white text-xs sm:text-lg truncate">
                                    {attendee.userDetails?.name || 'N/A'}
                                  </h3>
                                  {attendee.bannedFromEvent && (
                                    <span className="px-1 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full font-bold animate-pulse flex-shrink-0">
                                      🔒
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-400 text-xs truncate">{attendee.userDetails?.email || 'N/A'}</p>
                                <p className="text-gray-400 text-xs truncate hidden sm:block">{attendee.userDetails?.phone || 'N/A'}</p>
                                {attendee.bannedFromEvent && attendee.eventBanData?.bannedAt && (
                                  <p className="text-red-400 text-xs truncate hidden sm:block">
                                    Banned on {new Date(attendee.eventBanData.bannedAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
                              <span className={`px-1.5 py-1 text-xs sm:text-sm font-bold rounded-full ${
                                attendee.attended 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {attendee.attended ? '✓' : '○'}
                              </span>
                              
                              {/* Attendance Toggle Button - Blocked for banned users */}
                              {!attendee.bannedFromEvent ? (
                                <button
                                  onClick={() => toggleUserAttendance(attendee.userId, attendee.attended)}
                                  className={`w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-300 font-bold text-xs sm:text-lg ${
                                    attendee.attended
                                      ? 'bg-red-500/20 text-red-400 border-2 border-red-500/30 hover:bg-red-500/30 hover:scale-105'
                                      : 'bg-green-500/20 text-green-400 border-2 border-green-500/30 hover:bg-green-500/30 hover:scale-105'
                                  }`}
                                  title={attendee.attended ? 'Mark Absent' : 'Mark Present'}
                                >
                                  {attendee.attended ? '✗' : '✓'}
                                </button>
                              ) : (
                                <div className="w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-700/50 text-gray-500 border-2 border-gray-600/30 cursor-not-allowed">
                                  <span className="text-xs sm:text-lg">🔒</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-1 sm:mt-3 text-xs text-gray-400 hidden sm:block">
                            <span>Registered: {new Date(attendee.registeredAt).toLocaleDateString()}</span>
                            {attendee.attendedAt && (
                              <span className="ml-2 sm:ml-4">
                                Marked Attended: {new Date(attendee.attendedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
