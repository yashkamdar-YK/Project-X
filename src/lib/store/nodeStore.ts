import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';
import { INITIAL_EDGES, INITIAL_NODES } from '@/app/(root)/dashboard/strategy-builder/constants/menu';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { markUnsavedChanges } from './unsavedChangesStore';

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
        
        setNodes: (nodes) => set(() => {
          // Only mark as unsaved if nodes are different from INITIAL_NODES
          if (JSON.stringify(nodes) !== JSON.stringify(INITIAL_NODES)) {
            markUnsavedChanges();
          }
          return { nodes };
        }),

        setEdges: (edges) => set(() => {
          // Only mark as unsaved if edges are different from INITIAL_EDGES
          if (JSON.stringify(edges) !== JSON.stringify(INITIAL_EDGES)) {
            markUnsavedChanges();
          }
          return { edges };
        }),

        addNode: (newNode) => set((state) => {
          markUnsavedChanges();
          return {
            nodes: [...state.nodes, newNode],
          };
        }),

        clearNodesStore: () => set({ nodes: [], edges: [] }),
      }),
      {
        name: 'strategy-node-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);