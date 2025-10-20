import { defineStore } from "pinia";

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  credential: string;
}

// Keeper email whitelist
const KEEPER_EMAILS = ["dylan@odd.team", "funnyq@odd.team", "lara@306.team"];

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: null as GoogleUser | null,
    isAuthenticated: false,
    isInitialized: false,
  }),

  getters: {
    userName: (state) => state.currentUser?.name || "",
    userEmail: (state) => state.currentUser?.email || "",
    userPicture: (state) => state.currentUser?.picture || "",
    isLoggedIn: (state) => state.isAuthenticated && state.currentUser !== null,
    isKeeper: (state) => {
      if (!state.currentUser?.email) return false;
      return KEEPER_EMAILS.includes(state.currentUser.email.toLowerCase());
    },
  },

  actions: {
    setUser(user: GoogleUser | null) {
      this.currentUser = user;
      this.isAuthenticated = user !== null;

      // Store in localStorage for persistence
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    },

    logout() {
      this.currentUser = null;
      this.isAuthenticated = false;
      localStorage.removeItem("user");
    },

    // Restore user from localStorage on app initialization
    initializeUser() {
      if (this.isInitialized) return;

      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          this.currentUser = user;
          this.isAuthenticated = true;
        }
      } catch (error) {
        console.error("Failed to restore user from localStorage:", error);
        localStorage.removeItem("user");
      }

      this.isInitialized = true;
    },
  },
});
