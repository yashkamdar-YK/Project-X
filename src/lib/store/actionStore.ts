import {
  Position,
  PositionSettings,
} from "@/app/(root)/dashboard/strategy-builder/_components/StrategyNavbar/NodeSheet/ActionNodeSheet/types";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { markUnsavedChanges, useUnsavedChangesStore } from "./unsavedChangesStore";

// Define action types
export interface Action {
  func: "squareoff_all" | "stop_WaitTrade_triggers";
}

// Define item types that can be in a node
export type NodeItem = {
  id: string;
  type: 'action' | 'position';
  data: Action | Position;
  order: number;
};

// Define the store state interface
interface ActionState {
  actionNodes: {
    [nodeId: string]: {
      nodeName: string;
      items: NodeItem[];
    };
  };
  setActionNodes: (actionNodes: ActionState['actionNodes']) => void;
  createActionNode: (nodeId: string, name: string) => void;
  copyActionNode: (nodeId: string, newNodeId: string, label: string) => void;
  updateNodeName: (nodeId: string, name: string) => void;
  addAction: (nodeId: string, action: Action) => void;
  removeAction: (nodeId: string, actionFunc: string) => void;
  removeActionNode: (nodeId: string) => void;
  clearActionNodes: () => void;
  addPosition: (nodeId: string) => void;
  removePosition: (nodeId: string, positionId: string) => void;
  updatePositionSetting: (
    nodeId: string,
    positionId: string,
    field: keyof PositionSettings,
    value: any
  ) => void;
  moveItemUp: (nodeId: string, itemId: string) => void;
  moveItemDown: (nodeId: string, itemId: string) => void;
  duplicatePosition: (nodeId: string, positionId: string) => void;
}

const checkEditPermission = () => {
  const canEdit = useUnsavedChangesStore.getState().canEdit;
  if (!canEdit) {
    console.warn('Edit operation blocked: User does not have edit permission');
    return false;
  }
  return true;
};

const generateLegID = (items: NodeItem[]) => {
  const positions = items
    .filter((item): item is NodeItem & { data: Position } => 
      item.type === 'position')
    .map(item => item.data);

  if (!positions || positions.length === 0) return 1;
  
  const legIDs = positions.map((position) => position.settings.legID);
  const validLegIDs = legIDs.filter(id => typeof id === 'number' && Number.isFinite(id));
  
  return validLegIDs.length === 0 ? 1 : Math.max(...validLegIDs) + 1;
};

// Create the store with middleware
export const useActionStore = create<ActionState>()(
  devtools(
    persist(
      (set) => ({
        actionNodes: {},
        
        setActionNodes: (actionNodes) => {
          if (!checkEditPermission()) return;
          set({ actionNodes });
        },

        createActionNode: (nodeId, name) => {
          if (!checkEditPermission()) return;
          markUnsavedChanges();
          set((state) => ({
            actionNodes: {
              ...state.actionNodes,
              [nodeId]: {
                nodeName: name,
                items: [],
              },
            },
          }));
        },

        copyActionNode: (nodeId, newNodeId, label) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            const currentNode = state.actionNodes[nodeId];
            if (!currentNode) return state;

            return {
              actionNodes: {
                ...state.actionNodes,
                [newNodeId]: {
                  nodeName: label,
                  items: [...currentNode.items],
                },
              },
            };
          });
        },

        updateNodeName: (nodeId, name) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            return {
              actionNodes: {
                ...state.actionNodes,
                [nodeId]: {
                  ...state.actionNodes[nodeId],
                  nodeName: name,
                },
              },
            };
          });
        },

        addAction: (nodeId, action) => {
          if (!checkEditPermission()) return;
          set((state) => {
            const currentNode = state.actionNodes[nodeId];
            if (!currentNode) return state;
            
            // Check if action already exists
            if (currentNode.items.some(
              item => item.type === 'action' && 
              (item.data as Action).func === action.func
            )) {
              return state;
            }

            markUnsavedChanges();
            const newItem: NodeItem = {
              id: `action-${Date.now()}`,
              type: 'action',
              data: action,
              order: currentNode.items.length
            };

            return {
              actionNodes: {
                ...state.actionNodes,
                [nodeId]: {
                  ...currentNode,
                  items: [...currentNode.items, newItem],
                },
              },
            };
          });
        },

        removeAction: (nodeId, actionFunc) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            const currentNode = state.actionNodes[nodeId];
            if (!currentNode) return state;
            return {
              actionNodes: {
                ...state.actionNodes,
                [nodeId]: {
                  ...currentNode,
                  items: currentNode.items.filter(
                    item => !(item.type === 'action' && 
                    (item.data as Action).func === actionFunc)
                  ),
                },
              },
            };
          });
        },

        removeActionNode: (nodeId) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            const { [nodeId]: _, ...rest } = state.actionNodes;
            return {
              actionNodes: rest,
            };
          });
        },

        clearActionNodes: () => {
          if (!checkEditPermission()) return;
          set({ actionNodes: {} });
        },

        addPosition: (nodeId) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            const currentNode = state.actionNodes[nodeId];
            if (!currentNode) return state;

            const newPosition: Position = {
              id: `position-${Date.now()}`,
              settings: {
                legID: generateLegID(currentNode.items),
                transactionType: "buy",
                segment: "OPT",
                optionType: "CE",
                qty: 0,
                expType: "weekly",
                expNo: 0,
                strikeBy: "moneyness",
                strikeVal: 0,
                isTarget: false,
                targetOn: "%",
                targetValue: 0,
                isSL: false,
                SLon: "%",
                SLvalue: 0,
                isTrailSL: false,
                trailSLon: "%",
                trailSL_X: 0,
                trailSL_Y: 0,
                isWT: false,
                wtOn: "val-up",
                wtVal: 0,
                isReEntryTg: false,
                reEntryTgOn: "asap",
                reEntryTgVal: 0,
                reEntryTgMaxNo: 1,
                isReEntrySL: false,
                reEntrySLOn: "asap",
                reEntrySLVal: 0,
                reEntrySLMaxNo: 1,
              },
            };

            const newItem: NodeItem = {
              id: newPosition.id,
              type: 'position',
              data: newPosition,
              order: currentNode.items.length
            };

            return {
              actionNodes: {
                ...state.actionNodes,
                [nodeId]: {
                  ...currentNode,
                  items: [...currentNode.items, newItem],
                },
              },
            };
          });
        },

        removePosition: (nodeId, positionId) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            const currentNode = state.actionNodes[nodeId];
            if (!currentNode) return state;
            return {
              actionNodes: {
                ...state.actionNodes,
                [nodeId]: {
                  ...currentNode,
                  items: currentNode.items.filter(
                    item => !(item.type === 'position' && item.id === positionId)
                  ),
                },
              },
            };
          });
        },

        updatePositionSetting: (nodeId, positionId, field, value) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            const currentNode = state.actionNodes[nodeId];
            if (!currentNode) return state;
            return {
              actionNodes: {
                ...state.actionNodes,
                [nodeId]: {
                  ...currentNode,
                  items: currentNode.items.map(item => 
                    item.type === 'position' && item.id === positionId
                      ? {
                          ...item,
                          data: {
                            ...item.data as Position,
                            settings: {
                              ...(item.data as Position).settings,
                              [field]: value,
                            },
                          },
                        }
                      : item
                  ),
                },
              },
            };
          });
        },

        moveItemUp: (nodeId, itemId) => {
          if (!checkEditPermission()) return;
          set((state) => {
            const currentNode = state.actionNodes[nodeId];
            if (!currentNode) return state;

            const items = [...currentNode.items];
            const currentIndex = items.findIndex(item => item.id === itemId);
            if (currentIndex <= 0) return state;

            markUnsavedChanges();
            // Swap items
            const temp = items[currentIndex];
            items[currentIndex] = items[currentIndex - 1];
            items[currentIndex - 1] = temp;

            // Update order property
            items[currentIndex].order = currentIndex;
            items[currentIndex - 1].order = currentIndex - 1;

            return {
              actionNodes: {
                ...state.actionNodes,
                [nodeId]: {
                  ...currentNode,
                  items,
                },
              },
            };
          });
        },

        moveItemDown: (nodeId, itemId) => {
          if (!checkEditPermission()) return;
          set((state) => {
            const currentNode = state.actionNodes[nodeId];
            if (!currentNode) return state;

            const items = [...currentNode.items];
            const currentIndex = items.findIndex(item => item.id === itemId);
            if (currentIndex === -1 || currentIndex >= items.length - 1) return state;

            markUnsavedChanges();
            // Swap items
            const temp = items[currentIndex];
            items[currentIndex] = items[currentIndex + 1];
            items[currentIndex + 1] = temp;

            // Update order property
            items[currentIndex].order = currentIndex;
            items[currentIndex + 1].order = currentIndex + 1;

            return {
              actionNodes: {
                ...state.actionNodes,
                [nodeId]: {
                  ...currentNode,
                  items,
                },
              },
            };
          });
        },

        duplicatePosition: (nodeId, positionId) => {
          if (!checkEditPermission()) return;
          set((state) => {
            const currentNode = state.actionNodes[nodeId];
            if (!currentNode) return state;

            const position = currentNode.items.find(
              item => item.type === 'position' && item.id === positionId
            );
            if (!position) return state;

            markUnsavedChanges();
            const newPosition: NodeItem = {
              id: `position-${Date.now()}`,
              type: 'position',
              data: {
                ...(position.data as Position),
                id: `position-${Date.now()}`,
                settings: {
                  ...(position.data as Position).settings,
                  legID: generateLegID(currentNode.items),
                },
              },
              order: currentNode.items.length,
            };

            return {
              actionNodes: {
                ...state.actionNodes,
                [nodeId]: {
                  ...currentNode,
                  items: [...currentNode.items, newPosition],
                },
              },
            };
          });
        },
      }),
      {
        name: 'strategy-action-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);