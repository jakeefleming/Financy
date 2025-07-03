// Cursor and ChatGPT helped write this code
import axios from 'axios';

const API = 'https://project-api-financy.onrender.com/api';
// const API = 'http://localhost:9090/api';

const createAuthSlice = (set) => ({
  authenticated: false,
  user: null,
  error: null,

  signin: async (email, password) => {
    try {
      console.log('Attempting signin...');
      const response = await axios.post(`${API}/signin`, {
        email,
        password,
      });
      console.log('Signin successful, setting state');
      const { token, email: userEmail, firstName, lastName } = response.data;
      localStorage.setItem('token', token);

      // Parse the JWT to get Google tokens
      // help from ChatGPT here because I wanted to use zustand store instead of redux
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
          .join(''),
      );
      const { sub: id, googleAccessToken, googleRefreshToken } = JSON.parse(jsonPayload);

      set((state) => ({
        authSlice: {
          ...state.authSlice,
          authenticated: true,
          user: {
            id,
            email: userEmail,
            firstName,
            lastName,
            googleAccessToken,
            googleRefreshToken,
          },
          error: null,
        },
      }));

      return true;
    } catch (error) {
      console.error('Signin failed:', error);
      set((state) => ({
        authSlice: {
          ...state.authSlice,
          error: error.response?.data?.error || 'Sign in failed',
        },
      }));
      return false;
    }
  },

  signup: async (email, password, firstName, lastName) => {
    try {
      const response = await axios.post(`${API}/signup`, {
        email,
        password,
        firstName,
        lastName,
      });
      const { token, email: userEmail, firstName: userFirstName, lastName: userLastName } = response.data;
      localStorage.setItem('token', token);

      set((state) => ({
        authSlice: {
          ...state.authSlice,
          authenticated: true,
          user: { email: userEmail, firstName: userFirstName, lastName: userLastName },
          error: null,
        },
      }));
      return true;
    } catch (error) {
      set((state) => ({
        authSlice: {
          ...state.authSlice,
          error: error.response?.data?.error || 'Sign up failed',
        },
      }));
      return false;
    }
  },

  signout: () => {
    localStorage.removeItem('token');
    set(({ authSlice: draftState }) => {
      draftState.authenticated = false;
      draftState.user = null;
      draftState.error = null;
    }, false, 'auth/signout');
  },

  googleLogin: (token, userInfo) => {
    console.log('authSlice - googleLogin called with token and userInfo:', { token, userInfo });
    localStorage.setItem('token', token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('authSlice - Token payload:', payload);
    const userId = payload.sub;

    set(({ authSlice: draftState }) => {
      console.log('authSlice - Setting user state with tokens:', {
        googleAccessToken: userInfo.googleAccessToken,
        googleRefreshToken: userInfo.googleRefreshToken,
      });
      draftState.authenticated = true;
      draftState.user = {
        id: userId,
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        googleAccessToken: userInfo.googleAccessToken,
        googleRefreshToken: userInfo.googleRefreshToken,
      };
      draftState.error = null;
    }, false, 'auth/googleLogin');
  },

  checkAuth: async () => {
    console.log('Checking auth...');
    const token = localStorage.getItem('token');
    if (!token) {
      set(() => ({
        authenticated: false,
        user: null,
        error: null,
      }));
      return false;
    }

    try {
      const response = await axios.get(`${API}/contacts`, {
        headers: { Authorization: token },
      });

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
          .join(''),
      );

      const { sub: id, googleAccessToken, googleRefreshToken } = JSON.parse(jsonPayload);

      set(() => ({
        authenticated: true,
        user: {
          id,
          googleAccessToken,
          googleRefreshToken,
        },
        error: null,
      }));
      return true;
    } catch (error) {
      console.error('Token is invalid:', error);
      localStorage.removeItem('token');
      set(() => ({
        authenticated: false,
        user: null,
        error: 'Session expired. Please sign in again.',
      }));
      return false;
    }
  },
});

export default createAuthSlice;
