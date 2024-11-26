export const NODE_TYPES = {
  startNode: 'startNode',
  addNode: 'addNode',
  conditionNode: 'conditionNode',
  actionNode: 'actionNode',
} as const;

export const NODE_CATEGORIES = {
  CONDITION: 'Condition',
  ACTION: 'Action',
} as const;

export const NODE_CONFIG = {
  [NODE_TYPES.startNode]: {
    label: 'Start',
    category: 'System',
    style: {
      background: '#3B82F6',
      color: 'white',
      border: 'none',
      width: 48,
      height: 48,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  [NODE_TYPES.addNode]: {
    label: 'Add',
    category: 'System',
    style: {
      background: '#3B82F6',
      color: 'white',
      border: 'none',
      width: 48,
      height: 48,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  [NODE_TYPES.conditionNode]: {
    label: 'Condition',
    category: NODE_CATEGORIES.CONDITION,
    style: {
      background: 'white',
      border: '1px solid #E5E7EB',
      padding: '16px',
      borderRadius: '8px',
      minWidth: 200,
    },
  },
  [NODE_TYPES.actionNode]: {
    label: 'Action',
    category: NODE_CATEGORIES.ACTION,
    style: {
      background: 'white',
      border: '1px solid #E5E7EB',
      padding: '16px',
      borderRadius: '8px',
      minWidth: 200,
    },
  },
};

export type NodeType = keyof typeof NODE_TYPES;
export type NodeCategory = keyof typeof NODE_CATEGORIES;