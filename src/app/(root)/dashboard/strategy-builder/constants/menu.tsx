import { Database, BarChart2, Layers, Zap } from 'lucide-react';
import {  NodeTypes } from '../types/nodeTypes';
import { Edge, Node } from '@xyflow/react';

const DEFAULT_NODE_TEMPLATES : Node[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    type: NodeTypes.CONDITION,
    data:{
      label: 'Entry Condition',
    }
  },
  {
    id: '2',
    position: { x: 0, y: 0 },
    type: NodeTypes.ACTION,
    data:{
      label: 'Square off All',
    }
  },
  {
    id: '3',
    position: { x: 0, y: 0 },
    type: NodeTypes.CONDITION,
    data:{
      label: 'Exit Condition',
    }
  },
  {
    id: '4',
    position: { x: 0, y: 0 },
    type: NodeTypes.ACTION,
    data:{
      label: 'Buy',
    }
  },
];

export const SIDEBAR_SECTIONS = [
  {
    title: "Data Points",
    icon: Database,
  },
  {
    title: "Indicators",
    icon: BarChart2,
  },
  {
    title: "Components",
    icon: Layers,
    items: DEFAULT_NODE_TEMPLATES,
  },
  {
    title: "Actions",
    icon: Zap,
  },
];


export const INITIAL_NODES : Node[] = [
  {
    id: 'start',
    type: NodeTypes.START,
    position: { x: 250, y: 0 },
    data: { label: 'Start' },
    // draggable: false,
  },
  {
    id: 'initial-entry',
    position: { x: 180, y: 100 },
    type: NodeTypes.CONDITION,
    data: { 
      label: 'Entry Condition',
    },
  },
];

export const INITIAL_EDGES: Edge[] = [
  {
    id: 'start-entry',
    source: 'start',
    target: 'initial-entry',
    type: 'smoothstep',
  },
];