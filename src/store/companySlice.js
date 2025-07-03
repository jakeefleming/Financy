// Taken from lab4
// Cursor and ChatGPT helped write this code
import axios from 'axios';

const API = 'https://project-api-financy.onrender.com/api/companies';
// const API = 'http://localhost:9090/api/companies';

export default function createCompanySlice(set) {
  return {
    all: [],
    current: {},
    searchTerm: '',
    error: null,
    loading: false,

    setSearchTerm: (term) => {
      set(({ companySlice: draftState }) => {
        draftState.searchTerm = term;
      }, false, 'company/setSearchTerm');
    },

    fetchAll: async () => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(API, {
          headers: { Authorization: token },
        });
        set(({ companySlice: draftState }) => {
          draftState.all = response.data;
        }, false, 'company/fetchAll');
        return response.data;
      } catch (error) {
        console.error('Error fetching companies:', error);
        set({ error: error.response?.data?.error || 'Failed to fetch companies', loading: false });
      }
    },

    fetchOne: async (id) => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API}/${id}`, {
          headers: { Authorization: token },
        });
        set(({ companySlice: draftState }) => {
          draftState.current = response.data;
        }, false, 'company/fetchOne');
        return response.data;
      } catch (error) {
        console.error('Error fetching company:', error);
        set({ error: error.response?.data?.error || 'Failed to fetch company', loading: false });
      }
    },

    create: async (company) => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          API,
          company,
          { headers: { 'Content-Type': 'application/json', Authorization: token } },
        );
        set(({ companySlice: draftState }) => {
          draftState.all.push(response.data);
          draftState.current = response.data;
        }, false, 'company/create');
        return response.data;
      } catch (error) {
        console.error('Error creating company:', error);
        set({ error: error.response?.data?.error || 'Failed to create company', loading: false });
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
        set(({ companySlice: draftState }) => {
          const index = draftState.all.findIndex((c) => c._id === id);
          if (index !== -1) {
            draftState.all[index] = response.data;
          }
          if (draftState.current._id === id) {
            draftState.current = response.data;
          }
        }, false, 'company/update');
        return response.data;
      } catch (error) {
        console.error('Error updating company:', error);
        set({ error: error.response?.data?.error || 'Failed to update company', loading: false });
      }
    },

    remove: async (id) => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API}/${id}`, {
          headers: { Authorization: token },
        });
        set(({ companySlice: draftState }) => {
          draftState.all = draftState.all.filter((c) => c.id !== id);
          if (draftState.current.id === id) {
            draftState.current = {};
          }
        }, false, 'company/remove');
      } catch (error) {
        console.error('Error deleting company:', error);
        set({ error: error.response?.data?.error || 'Failed to delete company', loading: false });
      }
    },

    enrichCompany: async (linkedinUrl) => {
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
        console.error('Error enriching company:', error);
        set({ error: error.response?.data?.error || 'Failed to enrich company', loading: false });
        throw error;
      }
    },
  };
}
