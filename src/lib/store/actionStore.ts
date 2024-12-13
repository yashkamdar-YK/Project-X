import { Position, PositionSettings } from '@/app/(root)/dashboard/strategy-builder/_components/StrategyNavbar/NodeSheet/ActionNodeSheet/types';
import { create } from 'zustand';

// Define action types
interface Action {
  func: 'squareoff_all' | 'stop_WaitTrade_triggers';
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
  // Actions to modify state
  createActionNode: (nodeId: string) => void;
  updateNodeName: (nodeId: string, name: string) => void;
  addAction: (nodeId: string, action: Action) => void;
  removeAction: (nodeId: string, actionFunc: string) => void;
  addPosition: (nodeId: string) => void;
  removePosition: (nodeId: string, positionId: string) => void;
  updatePositionSetting: (
    nodeId: string,
    positionId: string,
    field: keyof PositionSettings,
    value: any
  ) => void;
}

// Create the store
export const useActionStore = create<ActionState>((set) => ({
  actionNodes: {},

  createActionNode: (nodeId: string) =>
    set((state) => ({
      actionNodes: {
        ...state.actionNodes,
        [nodeId]: {
          nodeName: '',
          actions: [],
          positions: [],
        },
      },
    })),

  updateNodeName: (nodeId: string, name: string) =>
    set((state) => ({
      actionNodes: {
        ...state.actionNodes,
        [nodeId]: {
          ...state.actionNodes[nodeId],
          nodeName: name,
        },
      },
    })),

  addAction: (nodeId: string, action: Action) =>
    set((state) => {
      const currentNode = state.actionNodes[nodeId];
      if (!currentNode) return state;

      // Don't add duplicate actions
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

  removeAction: (nodeId: string, actionFunc: string) =>
    set((state) => {
      const currentNode = state.actionNodes[nodeId];
      if (!currentNode) return state;

      return {
        actionNodes: {
          ...state.actionNodes,
          [nodeId]: {
            ...currentNode,
            actions: currentNode.actions.filter((action) => action.func !== actionFunc),
          },
        },
      };
    }),

  addPosition: (nodeId: string) =>
    set((state) => {
      const currentNode = state.actionNodes[nodeId];
      if (!currentNode) return state;

      const newPosition: Position = {
        id: `position-${Date.now()}`,
        type: 'Add Position',
        settings: {
          legID: currentNode.positions.length + 1,
          transactionType: 'buy',
          segment: 'OPT',
          optionType: 'CE',
          qty: 0,
          expType: 'weekly',
          expNo: 0,
          strikeBy: 'moneyness',
          strikeVal: 0,
          isTarget: false,
          targetOn: '%',
          targetValue: 0,
          isSL: false,
          SLon: '%',
          SLvalue: 0,
          isTrailSL: false,
          trailSLon: '%',
          trailSL_X: 0,
          trailSL_Y: 0,
          isWT: false,
          wtOn: 'val-up',
          wtVal: 0,
          isReEntryTg: false,
          reEntryTgOn: 'asap',
          reEntryTgVal: 0,
          reEntryTgMaxNo: 1,
          isReEntrySL: false,
          reEntrySLOn: 'asap',
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

  removePosition: (nodeId: string, positionId: string) =>
    set((state) => {
      const currentNode = state.actionNodes[nodeId];
      if (!currentNode) return state;

      return {
        actionNodes: {
          ...state.actionNodes,
          [nodeId]: {
            ...currentNode,
            positions: currentNode.positions.filter((position) => position.id !== positionId),
          },
        },
      };
    }),

  updatePositionSetting: (
    nodeId: string,
    positionId: string,
    field: keyof PositionSettings,
    value: any
  ) =>
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
}));