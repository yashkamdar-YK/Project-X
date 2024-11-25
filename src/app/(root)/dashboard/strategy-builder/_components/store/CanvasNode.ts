// Centralized store for managing nodes state
import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

interface NodeStore {
  nodes: Node[];
  edges: Edge[];
  addNode: (label: string, category: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

export const useNodeStore = create<NodeStore>((set) => ({
  nodes: [],
  edges: [],
  addNode: (label: string, category: string) => {
    const newNode: Node = {
      id: Date.now().toString(),
      position: {
        // Random position within a reasonable range
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: {
        label,
        category,
      },
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));
  },
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
}));
