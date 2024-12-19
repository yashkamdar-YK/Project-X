import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';
import { INITIAL_EDGES, INITIAL_NODES } from '@/app/(root)/dashboard/strategy-builder/constants/menu';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface NodeState {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  clearNodesStore: () => void;
}

export const useNodeStore = create<NodeState>()(
  devtools(
    persist(
      (set) => ({
        nodes: INITIAL_NODES,
        edges: INITIAL_EDGES,
        setNodes: (nodes) => set({ nodes }),
        setEdges: (edges) => set({ edges }),
        addNode: (newNode) =>
          set((state) => ({
            nodes: [...state.nodes, newNode],
          })),
        clearNodesStore: () => set({ nodes: [], edges: [] }),
      }),
      {
        name: 'strategy-node-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);