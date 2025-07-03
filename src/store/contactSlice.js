// Taken from lab4
// Cursor and ChatGPT helped write this code
import axios from 'axios';

const API = 'https://project-api-financy.onrender.com/api/contacts';
// const API = 'http://localhost:9090/api/contacts';

export default function createContactSlice(set) {
  return {
    all: [],
    current: {},
    searchTerm: '',
    error: null,
    loading: false,

    setSearchTerm: (term) => {
      set(({ contactSlice: draftState }) => {
        draftState.searchTerm = term;
      }, false, 'contact/setSearchTerm');
    },

    fetchAll: async () => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching contacts from:', `${API}`);
        const response = await axios.get(`${API}`, {
          headers: { Authorization: token },
        });
        console.log('Received contacts data:', response.data);
        set(({ contactSlice: draftState }) => {
          draftState.all = response.data;
        }, false, 'contact/fetchAll');
        return response.data;
      } catch (error) {
        console.error('Error fetching contacts:', error);
        set({ error: error.response?.data?.error || 'Failed to fetch contacts', loading: false });
        throw error;
      }
    },

    fetchOne: async (id) => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API}/${id}`, {
          headers: { Authorization: token },
        });
        set(({ contactSlice: draftState }) => {
          draftState.current = response.data;
        }, false, 'contact/fetchOne');
        return response.data;
      } catch (error) {
        console.error('Error fetching contact:', error);
        set({ error: error.response?.data?.error || 'Failed to fetch contact', loading: false });
        throw error;
      }
    },

    create: async (contact) => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${API}`,
          contact,
          { headers: { 'Content-Type': 'application/json', Authorization: token } },
        );
        set(({ contactSlice: draftState }) => {
          draftState.all.push(response.data);
          draftState.current = response.data;
        }, false, 'contact/create');
        return response.data;
      } catch (error) {
        console.error('Error creating contact:', error);
        set({ error: error.response?.data?.error || 'Failed to create contact', loading: false });
        throw error;
      }
    },

    update: async (id, updates) => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
          `${API}/${id}`,
          updates,
          { headers: { 'Content-Type': 'application/json', Authorization: token } },
        );
        set(({ contactSlice: draftState }) => {
          const index = draftState.all.findIndex((c) => c._id === id);
          if (index !== -1) {
            draftState.all[index] = response.data;
          }
          if (draftState.current._id === id) {
            draftState.current = response.data;
          }
        }, false, 'contact/update');
        return response.data;
      } catch (error) {
        console.error('Error updating contact:', error);
        set({ error: error.response?.data?.error || 'Failed to update contact', loading: false });
        throw error;
      }
    },

    remove: async (id) => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API}/${id}`, {
          headers: { Authorization: token },
        });
        set(({ contactSlice: draftState }) => {
          draftState.all = draftState.all.filter((c) => c._id !== id);
          if (draftState.current._id === id) {
            draftState.current = {};
          }
        }, false, 'contact/remove');
      } catch (error) {
        console.error('Error deleting contact:', error);
        set({ error: error.response?.data?.error || 'Failed to delete contact', loading: false });
      }
    },

    enrichContact: async (linkedinUrl) => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${API}/enrich`,
          { linkedin_url: linkedinUrl },
          { headers: { 'Content-Type': 'application/json', Authorization: token } },
        );
        return response.data;
      } catch (error) {
        console.error('Error enriching contact:', error);
        set({ error: error.response?.data?.error || 'Failed to enrich contact', loading: false });
        throw error;
      }
    },
  };
}
