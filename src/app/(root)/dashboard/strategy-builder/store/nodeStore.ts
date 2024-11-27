import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';
import { NODE_CONFIG, TNode } from "../types/nodeTypes";


interface NodeStore {
  nodes: Node[];
  edges: Edge[];
  addNode: (type: TNode, position?: { x: number; y: number }) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  initializeCanvas: () => void;
}

const INITIAL_NODES : TNode[] = [
  {
    id: 'start',
    type: "START",
    position: { x: 250, y: 0 },
    data: { label: 'Start' },
    draggable: false,
    style: NODE_CONFIG["START"],
  },
  {
    id: 'initial-entry',
    position: { x: 180, y: 100 },
    type:"CONDITION",
    data: { 
      label: 'Entry Condition',
    },
    style: NODE_CONFIG['CONDITION'],
  },
];

const INITIAL_EDGES: Edge[] = [
  {
    id: 'start-entry',
    source: 'start',
    target: 'initial-entry',
    type: 'smoothstep',
  },
];

export const useNodeStore = create<NodeStore>((set) => ({
  nodes: INITIAL_NODES,
  edges: INITIAL_EDGES,

  initializeCanvas: () => {
    set({
      nodes: INITIAL_NODES,
      edges: INITIAL_EDGES,
    });
  },

  addNode: (item, position) => {
    const newPosition = position || { x: 250, y: 0 };
    const newNode: Node = {
      id: `${item.type}-${Date.now()}`,
      type: item.type,
      position: newPosition,
      data: {
        label: item.data.label,
      },
      style: NODE_CONFIG[item.type],
    };

    set((state) => {
      // Add node and connect it to the last node in the chain
      const lastNode = state.nodes[state.nodes.length - 2];
      const endNode = state.nodes[state.nodes.length - 1];
      
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
          nodes: [...state.nodes.filter(n => n.type !== "START"), newNode, endNode],
          edges: filteredEdges,
        };
      }
      return state;
    });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
}));