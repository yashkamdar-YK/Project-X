import { create } from 'zustand';

interface UnsavedChangesState {
  isUnsaved: boolean;
  setUnsaved: (value: boolean) => void;
}

export const useUnsavedChangesStore = create<UnsavedChangesState>()((set) => ({
  isUnsaved: false,
  setUnsaved: (value) => set({ isUnsaved: value }),
}));

// Helper function to mark changes
export const markUnsavedChanges = () => {
  useUnsavedChangesStore.getState().setUnsaved(true);
};

// Helper function to mark saved
export const markChangesSaved = () => {
  useUnsavedChangesStore.getState().setUnsaved(false);
};