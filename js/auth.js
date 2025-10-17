/**
 * Google OAuth Authentication Module
 * Handles Google Sign-In using Google Identity Services (GIS)
 */

const GOOGLE_CLIENT_ID = "740864080269-28r9nsv3drtoqdju7h9d8903b9ea12h6.apps.googleusercontent.com";

let currentUser = null;

/**
 * Wait for Google Identity Services SDK to be loaded
 * @param {number} timeout - Maximum time to wait in milliseconds (default: 10000)
 * @returns {Promise<void>}
 */
function waitForGoogleSDK(timeout = 10000) {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (typeof window.google !== "undefined" && window.google.accounts) {
      resolve();
      return;
    }

    const startTime = Date.now();
    
    // Poll for Google SDK availability
    const checkInterval = setInterval(() => {
      if (typeof window.google !== "undefined" && window.google.accounts) {
        clearInterval(checkInterval);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error("Google Identity Services SDK failed to load within timeout"));
      }
    }, 100); // Check every 100ms
  });
}

/**
 * Initialize Google Identity Services
 * Should be called after the page loads
 */
export async function initGoogleAuth() {
  try {
    // Wait for Google SDK to be available
    await waitForGoogleSDK();

    // Check if already initialized
    if (window.googleAuthInitialized) {
      return;
    }

    // Initialize Google Identity Services
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.googleAuthInitialized = true;
    console.log("Google Auth initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Google Auth:", error);
    throw error;
  }
}

/**
 * Handle credential response from Google
 * @param {Object} response - Google credential response
 */
function handleCredentialResponse(response) {
  try {
    const credential = response.credential;
    const payload = parseJwt(credential);

    currentUser = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      credential: credential,
    };

    window.dispatchEvent(
      new CustomEvent("user-logged-in", { detail: currentUser })
    );
  } catch (error) {
    console.error("Failed to handle credential response:", error);
    window.dispatchEvent(
      new CustomEvent("user-login-error", { detail: error })
    );
  }
}

/**
 * Parse JWT token to extract payload
 * @param {string} token - JWT token
 * @returns {Object} Decoded payload
 */
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

/**
 * Trigger Google Sign-In flow
 * @returns {Promise<Object>} Resolves with user data on success
 */
export function signInWithGoogle() {
  return new Promise((resolve, reject) => {
    // If already signed in, return current user
    if (currentUser) {
      resolve(currentUser);
      return;
    }

    // Set up one-time event listeners
    const handleLogin = (event) => {
      window.removeEventListener("user-logged-in", handleLogin);
      window.removeEventListener("user-login-error", handleError);
      resolve(event.detail);
    };

    const handleError = (event) => {
      window.removeEventListener("user-logged-in", handleLogin);
      window.removeEventListener("user-login-error", handleError);
      reject(event.detail);
    };

    window.addEventListener("user-logged-in", handleLogin);
    window.addEventListener("user-login-error", handleError);

    // Trigger Google One Tap or Sign-In button
    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to rendering sign-in button in a modal
          // For now, reject with a message
          window.removeEventListener("user-logged-in", handleLogin);
          window.removeEventListener("user-login-error", handleError);
          reject(new Error("Google Sign-In prompt not available"));
        }
      });
    } catch (error) {
      window.removeEventListener("user-logged-in", handleLogin);
      window.removeEventListener("user-login-error", handleError);
      reject(error);
    }
  });
}

/**
 * Render Google Sign-In button in a specific element
 * @param {HTMLElement} element - Container element for the button
 * @param {Object} options - Button customization options
 */
export function renderSignInButton(element, options = {}) {
  const defaultOptions = {
    theme: "outline",
    size: "large",
    text: "signin_with",
    shape: "rectangular",
    logo_alignment: "left",
    width: 250,
  };

  window.google.accounts.id.renderButton(element, { ...defaultOptions, ...options });
}

/**
 * Sign out the current user
 */
export function signOut() {
  if (window.google && window.google.accounts && window.google.accounts.id) {
    window.google.accounts.id.disableAutoSelect();
  }
  currentUser = null;
  window.dispatchEvent(new CustomEvent("user-logged-out"));
}

/**
 * Get current logged-in user
 * @returns {Object|null} Current user or null if not logged in
 */
export function getCurrentUser() {
  return currentUser;
}

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export function isLoggedIn() {
  return currentUser !== null;
}
