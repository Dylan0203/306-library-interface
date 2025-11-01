/**
 * Google Authentication composable with Pinia store integration
 */

import { useUserStore } from "~/stores/user";
import type { GoogleUser } from "~/stores/user";

const GOOGLE_CLIENT_ID =
  "907501621329-l04imra4g4oknkf4u56pout84ljf16nl.apps.googleusercontent.com";
// "740864080269-28r9nsv3drtoqdju7h9d8903b9ea12h6.apps.googleusercontent.com";

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

declare global {
  interface Window {
    google?: any;
    googleAuthInitialized?: boolean;
  }
}

export const useAuth = () => {
  const userStore = useUserStore();

  /**
   * Wait for Google Identity Services SDK to be loaded
   */
  const waitForGoogleSDK = (timeout = 10000): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (typeof window !== "undefined" && window.google?.accounts) {
        resolve();
        return;
      }

      const startTime = Date.now();

      // Poll for Google SDK availability
      const checkInterval = setInterval(() => {
        if (typeof window !== "undefined" && window.google?.accounts) {
          clearInterval(checkInterval);
          resolve();
        } else if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval);
          reject(
            new Error(
              "Google Identity Services SDK failed to load within timeout",
            ),
          );
        }
      }, 100);
    });
  };

  /**
   * Parse JWT token to extract payload
   */
  const parseJwt = (token: string): JwtPayload => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  };

  /**
   * Handle credential response from Google
   */
  const handleCredentialResponse = (response: any) => {
    try {
      const credential = response.credential;
      const payload = parseJwt(credential);

      const user: GoogleUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        credential: credential,
      };

      // Store user in Pinia
      userStore.setUser(user);

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("user-logged-in", { detail: user }),
        );
      }
    } catch (error) {
      console.error("Failed to handle credential response:", error);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("user-login-error", { detail: error }),
        );
      }
    }
  };

  /**
   * Initialize Google Identity Services
   */
  const initGoogleAuth = async (): Promise<void> => {
    if (typeof window === "undefined") return;

    try {
      // Initialize user from localStorage first
      userStore.initializeUser();

      await waitForGoogleSDK();

      if (window.googleAuthInitialized) {
        return;
      }

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
  };

  /**
   * Trigger Google Sign-In flow
   */
  const signInWithGoogle = (): Promise<GoogleUser> => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Window not available"));
        return;
      }

      // If already signed in, return current user
      if (userStore.currentUser) {
        resolve(userStore.currentUser);
        return;
      }

      // Set up one-time event listeners
      const handleLogin = (event: any) => {
        window.removeEventListener("user-logged-in", handleLogin);
        window.removeEventListener("user-login-error", handleError);
        resolve(event.detail);
      };

      const handleError = (event: any) => {
        window.removeEventListener("user-logged-in", handleLogin);
        window.removeEventListener("user-login-error", handleError);
        reject(event.detail);
      };

      window.addEventListener("user-logged-in", handleLogin);
      window.addEventListener("user-login-error", handleError);

      // Trigger Google One Tap
      try {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
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
  };

  /**
   * Render Google Sign-In button
   */
  const renderSignInButton = (element: HTMLElement, options: any = {}) => {
    if (typeof window === "undefined" || !window.google) return;

    const defaultOptions = {
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      logo_alignment: "left",
      width: 250,
    };

    window.google.accounts.id.renderButton(element, {
      ...defaultOptions,
      ...options,
    });
  };

  /**
   * Sign out the current user
   */
  const signOut = () => {
    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }

    // Clear from Pinia store
    userStore.logout();

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("user-logged-out"));
    }
  };

  return {
    // State from Pinia store
    currentUser: computed(() => userStore.currentUser),
    isLoggedIn: computed(() => userStore.isLoggedIn),
    userName: computed(() => userStore.userName),
    userEmail: computed(() => userStore.userEmail),
    userPicture: computed(() => userStore.userPicture),

    // Actions
    initGoogleAuth,
    signInWithGoogle,
    renderSignInButton,
    signOut,
  };
};
