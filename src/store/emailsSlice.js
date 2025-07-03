// Cursor and ChatGPT helped write this code
import { create } from 'zustand';
import axios from 'axios';

const API = 'https://project-api-financy.onrender.com/api/emails';

const useEmailsSlice = create((set, get) => ({
  all: [],
  current: null,
  loading: false,
  error: null,
  selectedContactEmail: null,
  editedTemplateContent: null,
  draft: null,

  setSelectedContactEmail: (email) => {
    set({ selectedContactEmail: email });
  },

  setEditedTemplateContent: (content) => {
    set({ editedTemplateContent: content });
  },

  setDraft: (draftData) => {
    set({ draft: draftData });
  },

  clearDraft: () => {
    set({ draft: null });
  },

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API, {
        headers: { Authorization: token },
      });
      set({ all: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
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
      set({ current: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  create: async (templateData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API}/create`, templateData, {
        headers: { Authorization: token },
      });
      set((state) => ({
        all: [...state.all, response.data],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  update: async (id, templateData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API}/${id}`, templateData, {
        headers: { Authorization: token },
      });
      set((state) => ({
        all: state.all.map((template) => (template._id === id ? response.data : template)),
        current: response.data,
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
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
      set((state) => ({
        all: state.all.filter((template) => template._id !== id),
        current: state.current?._id === id ? null : state.current,
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  sendEmail: async (templateId, contactId, fieldValues) => {
    set({ loading: true, error: null });
    try {
      console.log('emailsSlice - Sending email with:', {
        templateId,
        contactId,
        fieldValues,
      });
      const token = localStorage.getItem('token');
      console.log('emailsSlice - Using token:', token ? 'present' : 'missing');

      const response = await axios.post(`${API}/send`, {
        templateId,
        contactId,
        fieldValues,
      }, {
        headers: { Authorization: token },
      });

      console.log('emailsSlice - Email sent successfully:', response.data);
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error('emailsSlice - Failed to send email:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      set({ error: error.response?.data?.message || error.message, loading: false });
      throw error;
    }
  },
}));

export default useEmailsSlice;
