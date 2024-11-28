import { Node, Edge } from '@xyflow/react';

export type NodeTypes = "CONDITION" | "ACTION" | "START";

export interface TNode extends Node {
  type: NodeTypes;
  data: {
    label: string;
  };
};

export const NODE_CONFIG: Record<NodeTypes , any> = {
  "START": {
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
  "ACTION": {
      background: 'white',
      border: '1px solid #E5E7EB',
      padding: '16px',
      borderRadius: '8px',
      minWidth: 200,
  },
  "CONDITION": {
      background: 'white',
      border: '1px solid #E5E7EB',
      padding: '16px',
      borderRadius: '8px',
      minWidth: 200,
  },
};