// Utility script to manage admin users
import { firebaseDB } from './firebaseUtils';

export const adminUtils = {
  // Make a user an admin
  makeAdmin: async (userId) => {
    try {
      const result = await firebaseDB.updateUserProfile(userId, {
        role: 'admin',
        updatedAt: new Date().toISOString(),
      });

      if (result.success) {
        console.log(`✅ User ${userId} is now an admin`);
        return { success: true };
      } else {
        console.error('❌ Failed to make user admin:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Error making user admin:', error);
      return { success: false, error: error.message };
    }
  },

  // Remove admin privileges from a user
  removeAdmin: async (userId) => {
    try {
      const result = await firebaseDB.updateUserProfile(userId, {
        role: 'user',
        updatedAt: new Date().toISOString(),
      });

      if (result.success) {
        console.log(`✅ User ${userId} is now a regular user`);
        return { success: true };
      } else {
        console.error('❌ Failed to remove admin privileges:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Error removing admin privileges:', error);
      return { success: false, error: error.message };
    }
  },

  // Check if a user is an admin
  checkAdminStatus: async (userId) => {
    try {
      const result = await firebaseDB.getUserProfile(userId);
      if (result.success) {
        const isAdmin = result.data.role === 'admin';
        console.log(`ℹ️ User ${userId} admin status: ${isAdmin}`);
        return { success: true, isAdmin };
      } else {
        console.error('❌ Failed to check admin status:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Error checking admin status:', error);
      return { success: false, error: error.message };
    }
  },

  // List all users (for admin management)
  listUsers: async () => {
    try {
      // Note: This would require a different Firebase structure to list all users
      // For now, this is a placeholder
      console.log('ℹ️ Listing users is not implemented in this version');
      console.log('💡 To list users, you would need to use Firebase Admin SDK');
      return { success: false, error: 'Not implemented' };
    } catch (error) {
      console.error('❌ Error listing users:', error);
      return { success: false, error: error.message };
    }
  },
};

// Usage examples:
// To make a user admin: adminUtils.makeAdmin('user-uid-here')
// To check admin status: adminUtils.checkAdminStatus('user-uid-here')
// To remove admin: adminUtils.removeAdmin('user-uid-here')

// Expose to window for browser console usage
if (typeof window !== 'undefined') {
  window.adminUtils = adminUtils;
}
