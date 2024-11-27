import { Database, BarChart2, Layers, Zap } from 'lucide-react';
import { TNode } from '../types/nodeTypes';

const DEFAULT_NODE_TEMPLATES : TNode[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    type: "CONDITION",
    data:{
      label: 'Entry Condition',
    }
  },
  {
    id: '2',
    position: { x: 0, y: 0 },
    type: "ACTION",
    data:{
      label: 'Square off All',
    }
  },
  {
    id: '3',
    position: { x: 0, y: 0 },
    type: "CONDITION",
    data:{
      label: 'Exit Condition',
    }
  },
  {
    id: '4',
    position: { x: 0, y: 0 },
    type: "ACTION",
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
