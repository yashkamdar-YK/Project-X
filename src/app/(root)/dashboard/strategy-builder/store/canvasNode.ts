import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';
import { NODE_TYPES, NODE_CONFIG } from '../constants/nodeTypes';

interface NodeStore {
  nodes: Node[];
  edges: Edge[];
  isRunning: boolean;
  addNode: (type: string, position?: { x: number; y: number }) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  toggleRunning: () => void;
  initializeCanvas: () => void;
}

const INITIAL_NODES: Node[] = [
  {
    id: 'start',
    type: NODE_TYPES.startNode,
    position: { x: 250, y: 0 },
    data: { label: 'Start' },
    draggable: false,
    style: NODE_CONFIG[NODE_TYPES.startNode].style,
  },
  {
    id: 'initial-entry',
    type: NODE_TYPES.conditionNode,
    position: { x: 180, y: 100 },
    data: { 
      label: 'Entry Condition',
      category: NODE_CONFIG[NODE_TYPES.conditionNode].category,
    },
    style: NODE_CONFIG[NODE_TYPES.conditionNode].style,
  },
  {
    id: 'end',
    type: NODE_TYPES.addNode,
    position: { x: 250, y: 200 },
    data: { label: 'Add' },
    draggable: false,
    style: NODE_CONFIG[NODE_TYPES.addNode].style,
  },
];

const INITIAL_EDGES: Edge[] = [
  {
    id: 'start-entry',
    source: 'start',
    target: 'initial-entry',
    type: 'smoothstep',
  },
  {
    id: 'entry-end',
    source: 'initial-entry',
    target: 'end',
    type: 'smoothstep',
  },
];

export const useNodeStore = create<NodeStore>((set) => ({
  nodes: INITIAL_NODES,
  edges: INITIAL_EDGES,
  isRunning: false,

  initializeCanvas: () => {
    set({
      nodes: INITIAL_NODES,
      edges: INITIAL_EDGES,
    });
  },

  addNode: (type, position) => {
    const newPosition = position || { x: 250, y: 0 };
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: newPosition,
      data: {
        label: NODE_CONFIG[type as keyof typeof NODE_TYPES].label,
        category: NODE_CONFIG[type as keyof typeof NODE_TYPES].category,
      },
      style: NODE_CONFIG[type as keyof typeof NODE_TYPES].style,
    };

    set((state) => {
      // Add node and connect it to the last node in the chain
      const lastNode = state.nodes.find(node => node.type !== NODE_TYPES.addNode);
      const endNode = state.nodes.find(node => node.type === NODE_TYPES.addNode);
      
      const newEdges = [...state.edges];
      if (lastNode && endNode) {
        // Remove the edge connecting to the end node
        const filteredEdges = newEdges.filter(edge => edge.target !== endNode.id);
        
        // Add new edges
        filteredEdges.push({
          id: `${lastNode.id}-${newNode.id}`,
          source: lastNode.id,
          target: newNode.id,
          type: 'smoothstep',
        });
        
        filteredEdges.push({
          id: `${newNode.id}-${endNode.id}`,
          source: newNode.id,
          target: endNode.id,
          type: 'smoothstep',
        });

        return {
          nodes: [...state.nodes.filter(n => n.type !== NODE_TYPES.addNode), newNode, endNode],
          edges: filteredEdges,
        };
      }
      return state;
    });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  toggleRunning: () => set((state) => ({ isRunning: !state.isRunning })),
}));