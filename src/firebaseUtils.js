import { auth, database } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { 
  getDatabase, 
  ref, 
  get, 
  set, 
  update, 
  remove,
  push,
  serverTimestamp 
} from 'firebase/database';

export const firebaseAuth = {
  // Email/Password Authentication
  signIn: async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  signUp: async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Google Authentication
  signInWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

export const firebaseDB = {
  // User Profile Operations
  saveUserProfile: async (userId, profileData) => {
    try {
      const userRef = ref(database, `users/${userId}`);
      await set(userRef, {
        ...profileData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getUserProfile: async (userId) => {
    try {
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return { success: true, data: snapshot.val() };
      } else {
        return { success: false, error: 'User profile not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Event-specific ban functions
  banUserFromEvent: async (userId, eventId, banned) => {
    try {
      const eventBanRef = ref(database, `eventBans/${userId}/${eventId}`);
      if (banned) {
        await set(eventBanRef, {
          banned: true,
          bannedAt: new Date().toISOString(),
          eventId: eventId
        });
      } else {
        await remove(eventBanRef);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  isUserBannedFromEvent: async (userId, eventId) => {
    try {
      const eventBanRef = ref(database, `eventBans/${userId}/${eventId}`);
      const snapshot = await get(eventBanRef);
      if (snapshot.exists()) {
        const banData = snapshot.val();
        return { success: true, banned: banData.banned || false, bannedAt: banData.bannedAt };
      }
      return { success: true, banned: false };
    } catch (error) {
      return { success: false, banned: false, error: error.message };
    }
  },

  getUserEventBans: async (userId) => {
    try {
      const eventBansRef = ref(database, `eventBans/${userId}`);
      const snapshot = await get(eventBansRef);
      if (snapshot.exists()) {
        const bans = snapshot.val();
        return { success: true, data: bans };
      }
      return { success: true, data: {} };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  updateUserProfile: async (userId, updates) => {
    try {
      const userRef = ref(database, `users/${userId}`);
      await update(userRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Event Registration
  registerForEvent: async (userId, eventId, eventData) => {
    try {
      // FIRST: Check if event reached capacity BEFORE registration
      try {
        // Get event data to check maxTickets
        const eventRef = ref(database, `events/${eventId}`);
        const eventSnapshot = await get(eventRef);

        if (eventSnapshot.exists()) {
          const eventData = eventSnapshot.val();
          const maxTickets = eventData.maxTickets;
          const isActive = eventData.active !== false;

          if (maxTickets && maxTickets > 0) {
            // Get current registration count
            const registrationsRef = ref(database, 'registrations');
            const registrationsSnapshot = await get(registrationsRef);
            let currentRegistrations = 0;

            if (registrationsSnapshot.exists()) {
              const allUsers = registrationsSnapshot.val();
              for (const userId in allUsers) {
                const userRegs = allUsers[userId];
                if (userRegs[eventId]) {
                  currentRegistrations++;
                }
              }
            }

            // Check if event is already at or over capacity
            if (currentRegistrations >= maxTickets) {
              return { success: false, error: 'Event is at full capacity' };
            }

            // Check if event is inactive
            if (!isActive) {
              return { success: false, error: 'Event is no longer available' };
            }
          }
        }
      } catch (capacityCheckError) {
        console.error('Error checking event capacity:', capacityCheckError);
        return { success: false, error: 'Unable to verify event availability' };
      }

      // SECOND: Proceed with registration only if capacity check passed
      const registrationRef = ref(database, `registrations/${userId}/${eventId}`);
      await set(registrationRef, {
        ...eventData,
        registeredAt: new Date().toISOString(),
        status: 'registered',
        attended: false,
      });

      // THIRD: Check if event reached capacity AFTER this registration and auto-deactivate if needed
      try {
        // Get event data to check maxTickets
        const eventRef = ref(database, `events/${eventId}`);
        const eventSnapshot = await get(eventRef);

        if (eventSnapshot.exists()) {
          const eventData = eventSnapshot.val();
          const maxTickets = eventData.maxTickets;

          if (maxTickets && maxTickets > 0) {
            // Get current registration count (including this new registration)
            const registrationsRef = ref(database, 'registrations');
            const registrationsSnapshot = await get(registrationsRef);
            let currentRegistrations = 0;

            if (registrationsSnapshot.exists()) {
              const allUsers = registrationsSnapshot.val();
              for (const userId in allUsers) {
                const userRegs = allUsers[userId];
                if (userRegs[eventId]) {
                  currentRegistrations++;
                }
              }
            }

            // If at or over capacity after this registration, deactivate the event
            if (currentRegistrations >= maxTickets) {
              const eventRef = ref(database, `events/${eventId}`);
              await update(eventRef, {
                active: false,
                updatedAt: new Date().toISOString(),
              });
              console.log(`Event ${eventId} automatically deactivated - reached capacity (${currentRegistrations}/${maxTickets})`);
            }
          }
        }
      } catch (capacityCheckError) {
        console.error('Error checking event capacity after registration:', capacityCheckError);
        // Don't fail registration if post-capacity check fails
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getUserRegistrations: async (userId) => {
    try {
      const registrationsRef = ref(database, `registrations/${userId}`);
      const snapshot = await get(registrationsRef);
      if (snapshot.exists()) {
        return { success: true, data: snapshot.val() };
      } else {
        return { success: true, data: {} };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Check if profile is complete
  isProfileComplete: (profileData) => {
    return profileData &&
           profileData.name && profileData.name.trim() &&
           profileData.college && profileData.college.trim() && profileData.college !== 'Not specified' &&
           profileData.phone && profileData.phone.trim() && profileData.phone !== 'Not specified';
  },

  // Event Management (Admin)
  createEvent: async (eventData) => {
    try {
      const eventsRef = ref(database, 'events');
      const newEventRef = push(eventsRef);
      await set(newEventRef, {
        ...eventData,
        id: newEventRef.key,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { success: true, eventId: newEventRef.key };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getAllEvents: async () => {
    try {
      const eventsRef = ref(database, 'events');
      const snapshot = await get(eventsRef);
      if (snapshot.exists()) {
        const events = snapshot.val();
        // Convert to array - include all events but mark inactive ones
        const eventsArray = Object.values(events);
        return { success: true, data: eventsArray };
      } else {
        return { success: true, data: [] };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getAllEventsAdmin: async () => {
    try {
      const eventsRef = ref(database, 'events');
      const snapshot = await get(eventsRef);
      if (snapshot.exists()) {
        const events = snapshot.val();
        const eventsArray = Object.values(events);
        return { success: true, data: eventsArray };
      } else {
        return { success: true, data: [] };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  updateEvent: async (eventId, updates) => {
    try {
      const eventRef = ref(database, `events/${eventId}`);
      await update(eventRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  toggleEventStatus: async (eventId, active) => {
    try {
      const eventRef = ref(database, `events/${eventId}`);
      await update(eventRef, {
        active,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getEventStats: async () => {
    try {
      const eventsRef = ref(database, 'events');
      const registrationsRef = ref(database, 'registrations');

      const [eventsSnapshot, registrationsSnapshot] = await Promise.all([
        get(eventsRef),
        get(registrationsRef)
      ]);

      let totalEvents = 0;
      let activeEvents = 0;
      let totalRegistrations = 0;
      let confirmedPayments = 0;

      if (eventsSnapshot.exists()) {
        const events = eventsSnapshot.val();
        const eventsArray = Object.values(events);
        totalEvents = eventsArray.length;
        activeEvents = eventsArray.filter(event => event.active !== false).length;
      }

      if (registrationsSnapshot.exists()) {
        const allRegistrations = registrationsSnapshot.val();
        // Count all registrations across all users
        Object.values(allRegistrations).forEach(userRegistrations => {
          Object.values(userRegistrations).forEach(registration => {
            totalRegistrations++;
            if (registration.status === 'confirmed') {
              confirmedPayments++;
            }
          });
        });
      }

      return {
        success: true,
        data: {
          totalEvents,
          activeEvents,
          totalRegistrations,
          confirmedPayments,
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getEventRegistrations: async (eventId) => {
    try {
      const registrationsRef = ref(database, 'registrations');
      const snapshot = await get(registrationsRef);
      const participants = [];
      if (snapshot.exists()) {
        const allUsers = snapshot.val();
        for (const userId in allUsers) {
          const userRegs = allUsers[userId];
          if (userRegs[eventId]) {
            const regData = userRegs[eventId];
            // Get user profile
            const profileResult = await firebaseDB.getUserProfile(userId);
            let profile = {};
            if (profileResult.success) {
              profile = profileResult.data;
            }
            participants.push({
              userId,
              ...regData,
              profile
            });
          }
        }
      }
      return { success: true, data: participants };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  updateEventRegistration: async (userId, eventId, updates) => {
    try {
      const regRef = ref(database, `registrations/${userId}/${eventId}`);
      await update(regRef, updates);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all users with their profiles and registrations
  getAllUsers: async () => {
    try {
      const usersRef = ref(database, 'users');
      const registrationsRef = ref(database, 'registrations');
      const eventsRef = ref(database, 'events');

      const [usersSnapshot, registrationsSnapshot, eventsSnapshot] = await Promise.all([
        get(usersRef),
        get(registrationsRef),
        get(eventsRef)
      ]);

      const users = [];
      const events = {};
      const registrations = {};

      // Get all events for mapping
      if (eventsSnapshot.exists()) {
        const eventsData = eventsSnapshot.val();
        for (const eventId in eventsData) {
          events[eventId] = eventsData[eventId];
        }
      }

      // Get all registrations for mapping
      if (registrationsSnapshot.exists()) {
        const registrationsData = registrationsSnapshot.val();
        for (const userId in registrationsData) {
          registrations[userId] = registrationsData[userId];
        }
      }

      // Process users
      if (usersSnapshot.exists()) {
        const usersData = usersSnapshot.val();
        for (const userId in usersData) {
          const userProfile = usersData[userId];
          const userRegistrations = registrations[userId] || {};
          
          // Get event details for each registration
          const registeredEvents = [];
          for (const eventId in userRegistrations) {
            const event = events[eventId];
            if (event) {
              registeredEvents.push({
                eventId,
                eventTitle: event.title,
                eventCategory: event.category,
                registeredAt: userRegistrations[eventId].registeredAt,
                status: userRegistrations[eventId].status,
                attended: userRegistrations[eventId].attended || false
              });
            }
          }

          users.push({
            userId,
            ...userProfile,
            registeredEvents,
            totalEvents: registeredEvents.length,
            banned: userProfile.banned || false
          });
        }
      }

      return { success: true, data: users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Ban/Unban user
  banUser: async (userId, banned) => {
    try {
      const userRef = ref(database, `users/${userId}`);
      await update(userRef, {
        banned,
        bannedAt: banned ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Ban multiple users
  banMultipleUsers: async (userIds, banned) => {
    try {
      const updates = {};
      userIds.forEach(userId => {
        updates[`users/${userId}`] = {
          banned,
          bannedAt: banned ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString(),
        };
      });
      
      // Update all users in a single batch
      for (const userId of userIds) {
        const userRef = ref(database, `users/${userId}`);
        await update(userRef, {
          banned,
          bannedAt: banned ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString(),
        });
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Mark attendance for a user in an event
  markAttendance: async (userId, eventId, attended = true) => {
    try {
      const registrationRef = ref(database, `registrations/${userId}/${eventId}`);
      await update(registrationRef, {
        attended,
        attendedAt: attended ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Mark attendance for multiple users in an event
  markMultipleAttendance: async (attendances) => {
    try {
      // attendances is an array of { userId, eventId, attended }
      const results = [];
      for (const attendance of attendances) {
        const result = await firebaseDB.markAttendance(
          attendance.userId, 
          attendance.eventId, 
          attendance.attended
        );
        results.push({ userId: attendance.userId, ...result });
      }
      
      const failed = results.filter(r => !r.success);
      if (failed.length > 0) {
        return { 
          success: false, 
          error: `Failed to mark attendance for ${failed.length} users`,
          failed: failed
        };
      }
      
      return { success: true, results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all attendees for an event
  getEventAttendees: async (eventId) => {
    try {
      const registrationsRef = ref(database, 'registrations');
      const snapshot = await get(registrationsRef);
      
      if (!snapshot.exists()) {
        return { success: true, data: [] };
      }
      
      const registrations = snapshot.val();
      const attendees = [];
      
      for (const userId in registrations) {
        const userRegistrations = registrations[userId];
        if (userRegistrations[eventId]) {
          attendees.push({
            userId,
            ...userRegistrations[eventId]
          });
        }
      }
      
      return { success: true, data: attendees };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get attendance statistics for an event
  getEventAttendanceStats: async (eventId) => {
    try {
      const result = await firebaseDB.getEventAttendees(eventId);
      if (!result.success) {
        return result;
      }
      
      const attendees = result.data;
      const stats = {
        totalRegistered: attendees.length,
        attended: attendees.filter(a => a.attended).length,
        notAttended: attendees.filter(a => !a.attended).length,
        attendanceRate: attendees.length > 0 
          ? Math.round((attendees.filter(a => a.attended).length / attendees.length) * 100)
          : 0
      };
      
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
