import { create } from 'zustand'

type SheetType = 'settings' | 'code' | null

interface SheetStore {
  isOpen: boolean
  type: SheetType
  selectedItem?: any
  openSheet: (type: SheetType, item?: any) => void
  closeSheet: () => void
}

export const useSheetStore = create<SheetStore>((set) => ({
  isOpen: false,
  type: null,
  selectedItem: undefined,
  
  openSheet: (type, item) => set({ 
    isOpen: true, 
    type, 
    selectedItem: item 
  }),
  
  closeSheet: () => set({ 
    isOpen: false, 
    type: null, 
    selectedItem: undefined 
  })
}))