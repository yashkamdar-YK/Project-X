// import { create } from 'zustand';
// import { Node, Edge } from '@xyflow/react';
// import { INITIAL_NODES, INITIAL_EDGES } from '../../app/(root)/dashboard/strategy-builder/constants/menu';

// interface NodeState {
//   nodes: Node[];
//   edges: Edge[];
//   setNodes: (nodes: Node[]) => void;
//   setEdges: (edges: Edge[]) => void;
//   addNodeWithEdge: (newNode: Node, sourceNodeId?: string) => void;
// }

// export const useNodeStore = create<NodeState>((set) => ({
//   nodes: INITIAL_NODES,
//   edges: INITIAL_EDGES,
  
//   setNodes: (nodes) => set({ nodes }),
  
//   setEdges: (edges) => set({ edges }),
  
//   addNodeWithEdge: (newNode, sourceNodeId = 'start') => set((state) => {
//     const finalNode = {
//       ...newNode,
//       id: Date.now().toString(),
//     };

//     // Create a new edge that defaultly connected to start node
//     const newEdge: Edge = {
//       id: `${sourceNodeId}-${finalNode.id}`,
//       source: sourceNodeId,
//       target: finalNode.id,
//       type: 'smoothstep',
//     };

//     return {
//       nodes: [...state.nodes, finalNode],
//       edges: [...state.edges, newEdge],
//     };
//   }),
// }));


import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';
import { INITIAL_EDGES, INITIAL_NODES } from '@/app/(root)/dashboard/strategy-builder/constants/menu';


interface NodeState {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
}

export const useNodeStore = create<NodeState>((set) => ({
  nodes: INITIAL_NODES,
  edges: INITIAL_EDGES,
  
  setNodes: (nodes) => set({ nodes }),
  
  setEdges: (edges) => set({ edges }),
  
  addNode: (newNode) => set((state) => ({
    nodes: [...state.nodes, newNode],
  })),
  
 
}));