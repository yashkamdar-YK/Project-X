import { create } from 'zustand'

type SheetType = 'settings' | 'code' | null

interface SheetStore {
  isOpen: boolean
  type: SheetType
  selectedItem?: any
  openSheet: (type: SheetType, item?: any) => void
  closeSheet: () => void
}

export const useSheetStore = create<SheetStore>((set, get) => ({
  isOpen: false,
  type: null,
  selectedItem: undefined,
  
  openSheet: (type, item) => {
    const currentState = get();
    
    // If sheet is already open with same type, close it
    if (currentState.type === type && currentState.isOpen) {
      set({ 
        isOpen: false, 
        type: null, 
        selectedItem: undefined 
      });
      return;
    }

    // Otherwise open with new type
    set({ 
      isOpen: true, 
      type, 
      selectedItem: item 
    });
  },
  
  closeSheet: () => set({ 
    isOpen: false, 
    type: null, 
    selectedItem: undefined 
  })
}))