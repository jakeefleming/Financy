// Cursor and ChatGPT helped write this code
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'https://project-api-financy.onrender.com/api/';
// const API_URL = 'http://localhost:9090/api/';
const API_KEY = '';

export default function createTaskSlice(set, get) {
  return {
    all: [],
    current: {},
    error: null,
    loading: false,

    fetchAll: async () => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}tasks${API_KEY}`, {
          headers: { Authorization: token },
        });
        const { data } = response;
        set(({ taskSlice: draftState }) => { draftState.all = data; }, false, 'tasks/fetchedAll');
        set({ loading: false });
      } catch (error) {
        console.error('Error fetching tasks:', error);
        set({ error: error.response?.data?.error || 'Failed to fetch tasks', loading: false });
      }
    },

    fetchTask: async (id) => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}tasks/${id}${API_KEY}`, {
          headers: { Authorization: token },
        });
        const { data } = response;
        set(({ taskSlice: draftState }) => { draftState.current = data; }, false, 'tasks/fetchedTask');
        set({ loading: false });
      } catch (error) {
        console.error('Error fetching task:', error);
        set({ error: error.response?.data?.error || 'Failed to fetch task', loading: false });
      }
    },

    addTask: async (newTask) => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        const taskData = {
          title: 'Task',
          content: newTask.content,
          isCompleted: newTask.isCompleted || false,
          dueDate: newTask.dueDate,
          tags: newTask.tags || [],
          contactId: newTask.contactId || undefined,
          companyId: newTask.companyId || undefined,
        };
        const response = await axios.post(`${API_URL}tasks${API_KEY}`, taskData, {
          headers: { Authorization: token },
        });
        set(({ taskSlice: draftState }) => { draftState.all.push(response.data); }, false, 'tasks/addedTask');
        toast.success('Task created successfully!');
        set({ loading: false });
      } catch (error) {
        console.error('Error adding task:', error);
        set({ error: error.response?.data?.error || 'Failed to create task', loading: false });
      }
    },

    updateTask: async (id, updatedTask) => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        const taskData = {
          title: 'Task',
          content: updatedTask.content,
          isCompleted: updatedTask.isCompleted,
          dueDate: updatedTask.dueDate,
          tags: updatedTask.tags,
          contactId: updatedTask.contactId || undefined,
          companyId: updatedTask.companyId || undefined,
        };
        const response = await axios.put(`${API_URL}tasks/${id}${API_KEY}`, taskData, {
          headers: { Authorization: token },
        });
        const { data } = response;
        set(({ taskSlice: draftState }) => {
          draftState.all = draftState.all.map((task) => (task._id === id ? data : task));
          draftState.current = data;
        }, false, 'tasks/updatedTask');
        toast.success('Task updated successfully!');
        set({ loading: false });
      } catch (error) {
        console.error('Error updating task:', error);
        set({ error: error.response?.data?.error || 'Failed to update task', loading: false });
      }
    },

    deleteTask: async (id) => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}tasks/${id}${API_KEY}`, {
          headers: { Authorization: token },
        });
        set(({ taskSlice: draftState }) => {
          draftState.all = draftState.all.filter((task) => task._id !== id);
        }, false, 'tasks/deletedTask');
        toast.success('Task deleted successfully!');
        set({ loading: false });
      } catch (error) {
        console.error('Error deleting task:', error);
        set({ error: error.response?.data?.error || 'Failed to delete task', loading: false });
      }
    },
  };
}
