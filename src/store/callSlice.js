// Cursor and ChatGPT helped write this code
import axios from 'axios';
import { toast } from 'react-toastify';

const API = 'https://project-api-financy.onrender.com/api/calls';
// const API = 'http://localhost:9090/api/calls';

export default function createCallSlice(set, get) {
  return {
    all: [],
    current: {},
    error: null,
    loading: false,

    fetchAll: async () => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(API, {
          headers: { Authorization: token },
        });
        set(({ callSlice: draftState }) => {
          draftState.all = response.data;
        }, false, 'call/fetchAll');
        return response.data;
      } catch (error) {
        console.error('Error fetching calls:', error);
        set({ error: error.response?.data?.error || 'Failed to fetch calls', loading: false });
        throw error;
      }
    },

    fetchOne: async (id) => {
      set(({ callSlice: draftState }) => {
        draftState.loading = true;
        draftState.error = null;
      }, false, 'call/fetchOne/start');
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API}/${id}`, {
          headers: { Authorization: token },
        });
        set(({ callSlice: draftState }) => {
          draftState.current = response.data;
          draftState.loading = false;
        }, false, 'call/fetchOne/success');
        return response.data;
      } catch (error) {
        console.error('Error fetching call:', error);
        set(({ callSlice: draftState }) => {
          draftState.error = error.response?.data?.error || 'Failed to fetch call';
          draftState.loading = false;
        }, false, 'call/fetchOne/error');
        throw error;
      }
    },

    create: async (call) => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          API,
          call,
          { headers: { 'Content-Type': 'application/json', Authorization: token } },
        );
        set(({ callSlice: draftState }) => {
          draftState.all.push(response.data);
          draftState.current = response.data;
        }, false, 'call/create');
        toast.success('Call created successfully!');
        return response.data;
      } catch (error) {
        console.error('Error creating call:', error);
        set({ error: error.response?.data?.error || 'Failed to create call', loading: false });
        toast.error(`Failed to create call: ${error.message}`);
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
        set(({ callSlice: draftState }) => {
          const index = draftState.all.findIndex((c) => c._id === id);
          if (index !== -1) {
            draftState.all[index] = response.data;
          }
          if (draftState.current._id === id) {
            draftState.current = response.data;
          }
        }, false, 'call/update');
        toast.success('Call updated successfully!');
        return response.data;
      } catch (error) {
        console.error('Error updating call:', error);
        set({ error: error.response?.data?.error || 'Failed to update call', loading: false });
        toast.error(`Failed to update call: ${error.message}`);
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
        set(({ callSlice: draftState }) => {
          draftState.all = draftState.all.filter((c) => c._id !== id);
          if (draftState.current._id === id) {
            draftState.current = {};
          }
        }, false, 'call/remove');
        toast.success('Call deleted successfully!');
      } catch (error) {
        console.error('Error deleting call:', error);
        set({ error: error.response?.data?.error || 'Failed to delete call', loading: false });
        toast.error(`Failed to delete call: ${error.message}`);
        throw error;
      }
    },
  };
}
