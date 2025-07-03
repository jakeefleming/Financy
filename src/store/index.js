// Cursor and ChatGPT helped write this code
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import createTaskSlice from './taskSlice';
import createCallSlice from './callSlice';
import createContactSlice from './contactSlice';
import createCompanySlice from './companySlice';
import createAuthSlice from './authSlice';

// Create store with slices
const useStore = create(
  devtools(
    immer((set, get) => ({
      taskSlice: createTaskSlice(set, get),
      callSlice: createCallSlice(set),
      contactSlice: createContactSlice(set),
      companySlice: createCompanySlice(set),
      authSlice: createAuthSlice(set),
    })),
    {
      name: 'financy-store',
      enabled: process.env.NODE_ENV === 'development',
    },
  ),
);

// Export the full store
export default useStore;

// Export individual slices for direct imports
export const useTaskSlice = () => useStore((state) => state.taskSlice);
export const useCallSlice = () => useStore((state) => state.callSlice);
export const useContactSlice = () => useStore((state) => state.contactSlice);
export const useCompanySlice = () => useStore((state) => state.companySlice);
export const useAuthSlice = () => useStore((state) => state.authSlice);
