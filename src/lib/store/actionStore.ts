import {
  Position,
  PositionSettings,
} from "@/app/(root)/dashboard/strategy-builder/_components/StrategyNavbar/NodeSheet/ActionNodeSheet/types";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

// Define action types
export interface Action {
  func: "squareoff_all" | "stop_WaitTrade_triggers";
}

// Define the store state interface
interface ActionState {
  actionNodes: {
    [nodeId: string]: {
      nodeName: string;
      actions: Action[];
      positions: Position[];
    };
  };
  setActionNodes: (actionNodes: {
    [nodeId: string]: {
      nodeName: string;
      actions: Action[];
      positions: Position[];
    };
  }) => void;
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
}

const generateLegID = (positions: Position[]) => {
  if (!positions || positions.length === 0) {
    return 1;
  }
  const legIDs = positions.map((position) => position.settings.legID);
  const validLegIDs = legIDs.filter(id => typeof id === 'number' && Number.isFinite(id));
  
  if (validLegIDs.length === 0) {
    return 1;
  }
  
  return Math.max(...validLegIDs) + 1;
};

// Create the store with middleware
export const useActionStore = create<ActionState>()(
  devtools(
    persist(
      (set) => ({
        actionNodes: {},
        setActionNodes: (actionNodes) => set({ actionNodes: { ...actionNodes } }),
        createActionNode: (nodeId, name) =>
          set((state) => ({
            actionNodes: {
              ...state.actionNodes,
              [nodeId]: {
                nodeName: name,
                actions: [],
                positions: [],
              },
            },
          })),
        copyActionNode: (nodeId, newNodeId, label) =>
          set((state) => {
            const currentNode = state.actionNodes[nodeId];
            if (!currentNode) return state;

            return {
              actionNodes: {
                ...state.actionNodes,
                [newNodeId]: {
                  nodeName: label,
                  actions: currentNode.actions,
                  positions: currentNode.positions,
                },
              },
            };
          }),
        updateNodeName: (nodeId, name) =>
          set((state) => ({
            actionNodes: {
              ...state.actionNodes,
              [nodeId]: {
                ...state.actionNodes[nodeId],
                nodeName: name,
              },
            },
          })),
        addAction: (nodeId, action) =>
          set((state) => {
            const currentNode = state.actionNodes[nodeId];
            if (!currentNode) return state;
            if (currentNode.actions.some((a) => a.func === action.func)) {
              return state;
            }
            return {
              actionNodes: {
                ...state.actionNodes,
                [nodeId]: {
                  ...currentNode,
                  actions: [...currentNode.actions, action],
                },
              },
            };
          }),
        removeAction: (nodeId, actionFunc) =>
          set((state) => {
            const currentNode = state.actionNodes[nodeId];
            if (!currentNode) return state;
            return {
              actionNodes: {
                ...state.actionNodes,
                [nodeId]: {
                  ...currentNode,
                  actions: currentNode.actions.filter(
                    (action) => action.func !== actionFunc
                  ),
                },
              },
            };
          }),
        removeActionNode: (nodeId) =>
          set((state) => {
            const { [nodeId]: _, ...rest } = state.actionNodes;
            return {
              actionNodes: rest,
            };
          }),
        clearActionNodes: () => set({ actionNodes: {} }),
        addPosition: (nodeId) =>
          set((state) => {
            const currentNode = state.actionNodes[nodeId];
            if (!currentNode) return state;

            const newPosition: Position = {
              id: `position-${Date.now()}`,
              type: "Add Position",
              settings: {
                legID: generateLegID(currentNode.positions),
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

            return {
              actionNodes: {
                ...state.actionNodes,
                [nodeId]: {
                  ...currentNode,
                  positions: [...currentNode.positions, newPosition],
                },
              },
            };
          }),
        removePosition: (nodeId, positionId) =>
          set((state) => {
            const currentNode = state.actionNodes[nodeId];
            if (!currentNode) return state;
            return {
              actionNodes: {
                ...state.actionNodes,
                [nodeId]: {
                  ...currentNode,
                  positions: currentNode.positions.filter(
                    (position) => position.id !== positionId
                  ),
                },
              },
            };
          }),
        updatePositionSetting: (nodeId, positionId, field, value) =>
          set((state) => {
            const currentNode = state.actionNodes[nodeId];
            if (!currentNode) return state;
            return {
              actionNodes: {
                ...state.actionNodes,
                [nodeId]: {
                  ...currentNode,
                  positions: currentNode.positions.map((position) =>
                    position.id === positionId
                      ? {
                          ...position,
                          settings: {
                            ...position.settings,
                            [field]: value,
                          },
                        }
                      : position
                  ),
                },
              },
            };
          }),
      }),
      {
        name: 'strategy-action-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);