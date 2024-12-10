// import { create } from 'zustand'

// type SheetType = 'settings' | 'code' | 'node' | null

// interface SheetStore {
//   isOpen: boolean
//   type: SheetType
//   selectedItem?: any
//   openSheet: (type: SheetType, item?: any) => void
//   closeSheet: () => void
// }

// export const useSheetStore = create<SheetStore>((set, get) => ({
//   isOpen: false,
//   type: null,
//   selectedItem: undefined,
  
//   openSheet: (type, item) => {
//     const currentState = get();
    
//     // If sheet is already open with same type, close it
//     if (currentState.type === type && currentState.isOpen) {
//       set({ 
//         isOpen: false, 
//         type: null, 
//         selectedItem: undefined 
//       });
//       return;
//     }

//     // Otherwise open with new type
//     set({ 
//       isOpen: true, 
//       type, 
//       selectedItem: item 
//     });
//   },
  
//   closeSheet: () => set({ 
//     isOpen: false, 
//     type: null, 
//     selectedItem: undefined 
//   })
// }))

import { create } from 'zustand'
import { Node } from '@xyflow/react'
import { NodeTypes } from '@/app/(root)/dashboard/strategy-builder/_utils/nodeTypes' // Adjust import path as needed

type SheetType = 'settings' | 'code' | 'node' | null
type NodeSheetType = typeof NodeTypes.CONDITION | typeof NodeTypes.ACTION | null

interface SheetStore {
  isOpen: boolean
  type: SheetType
  nodeType: NodeSheetType
  selectedItem?: Node | any
  openSheet: (type: SheetType, item?: Node | any) => void
  closeSheet: () => void
}

export const useSheetStore = create<SheetStore>((set, get) => ({
  isOpen: false,
  type: null,
  nodeType: null,
  selectedItem: undefined,
  
  openSheet: (type, item) => {
    const currentState = get();
    
    // If sheet is already open with same type, close it
    if (currentState.type === type && currentState.isOpen) {
      set({ 
        isOpen: false, 
        type: null, 
        nodeType: null,
        selectedItem: undefined 
      });
      return;
    }

    // Determine node type if it's a node sheet
    const nodeType = type === 'node' && item?.type ? 
      item.type === NodeTypes.CONDITION ? NodeTypes.CONDITION : 
      item.type === NodeTypes.ACTION ? NodeTypes.ACTION : 
      null : null;

    // Otherwise open with new type
    set({ 
      isOpen: true, 
      type, 
      nodeType, // Add node type
      selectedItem: item 
    });
  },
  
  closeSheet: () => set({ 
    isOpen: false, 
    type: null, 
    nodeType: null,
    selectedItem: undefined 
  })
}))