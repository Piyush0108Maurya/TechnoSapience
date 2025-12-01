// Utility functions for handling routing
// Netlify deployment uses root path, no subdirectory needed

const BASENAME = '';

/**
 * Get the full redirect URL with basename for GitHub Pages
 * @param {string} path - The path to redirect to (e.g., '/login')
 * @returns {string} - The full URL with basename
 */
export const getRedirectUrl = (path) => {
  return BASENAME + path;
};

/**
 * Navigate to a path with proper basename handling
 * @param {string} path - The path to navigate to
 */
export const navigateTo = (path) => {
  window.location.href = getRedirectUrl(path);
};

/**
 * Get the current path without the basename
 * @returns {string} - The current path without basename
 */
export const getCurrentPath = () => {
  const pathname = window.location.pathname;
  if (pathname.includes(BASENAME)) {
    return pathname.replace(BASENAME, '') || '/';
  }
  return pathname;
};

/**
 * Check if the app is deployed on GitHub Pages
 * @returns {boolean} - True if deployed on GitHub Pages
 */
export const isGitHubPages = () => {
  return window.location.hostname.includes('github.io');
};
