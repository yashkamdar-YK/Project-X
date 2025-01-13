import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';
import { INITIAL_EDGES, INITIAL_NODES } from '@/app/(root)/dashboard/strategy-builder/constants/menu';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { markUnsavedChanges, useUnsavedChangesStore } from './unsavedChangesStore';

interface NodeState {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  clearNodesStore: () => void;
}

const checkEditPermission = () => {
  const canEdit = useUnsavedChangesStore.getState().canEdit;
  if (!canEdit) {
    console.warn('Edit operation blocked: User does not have edit permission');
    return false;
  }
  return true;
};

export const useNodeStore = create<NodeState>()(
  devtools(
    persist(
      (set) => ({
        nodes: INITIAL_NODES,
        edges: INITIAL_EDGES,
        
        setNodes: (nodes) => {
          if (!checkEditPermission()) return;
          set(() => {
            // Only mark as unsaved if nodes are different from INITIAL_NODES
            if (JSON.stringify(nodes) !== JSON.stringify(INITIAL_NODES)) {
              markUnsavedChanges();
            }
            return { nodes };
          });
        },

        setEdges: (edges) => {
          if (!checkEditPermission()) return;
          set(() => {
            // Only mark as unsaved if edges are different from INITIAL_EDGES
            if (JSON.stringify(edges) !== JSON.stringify(INITIAL_EDGES)) {
              markUnsavedChanges();
            }
            return { edges };
          });
        },

        addNode: (newNode) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            return {
              nodes: [...state.nodes, newNode],
            };
          });
        },

        clearNodesStore: () => {
          if (!checkEditPermission()) return;
          set({ nodes: [], edges: [] });
        },
      }),
      {
        name: 'strategy-node-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);