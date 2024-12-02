import { Database, BarChart2, Layers, Zap } from "lucide-react";
import { NodeTypes } from "../_utils/nodeTypes";
import { Edge, Node, Position } from "@xyflow/react";

export const DEFAULT_NODE_TEMPLATES: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: NodeTypes.CONDITION,
    data: {
      label: "Entry Condition",
    },
  },
  {
    id: "2",
    position: { x: 0, y: 0 },
    type: NodeTypes.ACTION,
    data: {
      label: "Square off All",
    },
  },
  {
    id: "3",
    position: { x: 0, y: 0 },
    type: NodeTypes.CONDITION,
    data: {
      label: "Exit Condition",
    },
  },
  {
    id: "4",
    position: { x: 0, y: 0 },
    type: NodeTypes.ACTION,
    data: {
      label: "Buy",
    },
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

export const INITIAL_NODES: Node[] = [
  {
    id: "start",
    type: NodeTypes.START,
    position: { x: 281, y: 0 },
    data: { label: "Start" },
    // draggable: false,
  },
  {
    id: "initial-entry",
    position: { x: 180, y: 200 },
    type: NodeTypes.CONDITION,
    data: {
      label: "Entry Condition",
    },
  },
];

export const INITIAL_EDGES: Edge[] = [
  {
    id: "start-entry",
    source: "start",
    target: "initial-entry",
    type: "smoothstep",
  },
];


export const STRATEGY_TEMPLATES = {
  MOVING_AVERAGE_CROSSOVER: {
    name: "Moving Average Crossover",
    description: "A strategy based on 2 moving average crossovers",
    nodes: [
      {
        id: "start",
        type: NodeTypes.START,
        position: { x: 281, y: 0 },
        data: { label: "Start" },
      },
      {
        id: "entry-condition",
        position: { x: 180, y: 120 },
        type: NodeTypes.CONDITION,
        data: {
          label: "Entry: MA(20) crosses above MA(50)",
          settings: {
            indicator1: "MA",
            period1: 20,
            indicator2: "MA",
            period2: 50,
            comparison: "crossAbove",
          },
        },
        // sourcePosition: Position.Bottom,
        // targetPosition: Position.Top
      },
      {
        id: "buy-action",
        position: { x: 580, y: 120 },
        type: NodeTypes.ACTION,
        data: {
          label: "Buy",
          settings: {
            action: "BUY",
            quantity: 1,
            orderType: "MARKET",
          },
        },
      },
      {
        id: "exit-condition",
        position: { x: 180, y: 240 },
        type: NodeTypes.CONDITION,
        data: {
          label: "Exit: MA(20) crosses below MA(50)",
          settings: {
            indicator1: "MA",
            period1: 20,
            indicator2: "MA",
            period2: 50,
            comparison: "crossBelow",
          },
        },
        // sourcePosition: Position.Bottom,
        // targetPosition: Position.Top
      },
      {
        id: "sell-action",
        position: { x: 580, y: 240 },
        type: NodeTypes.ACTION,
        data: {
          label: "Sell",
          settings: {
            action: "SELL",
            quantity: 1,
            orderType: "MARKET",
          },
        },
      },
    ],
    edges: [
      {
        id: "start-entry",
        source: "start",
        target: "entry-condition",
        type: "smoothstep",
      },
      {
        id: "entry-buy",
        source: "entry-condition",
        target: "buy-action",
        type: "smoothstep",
      },
      {
        id: "entry-exit",
        source: "entry-condition",
        target: "exit-condition",
        // sourceHandle: "bottom",
        // targetHandle: "top",
        type: "smoothstep",
      },
      // {
      //   id: "entry-condition-to-exit-condition", // New edge between condition nodes
      //   source: "entry-condition", 
      //   target: "exit-condition",
      //   sourceHandle: "bottom",
      //   targetHandle: "top",
      //   type: "smoothstep",
      // }
      {
        id: "exit-sell",
        source: "exit-condition",
        target: "sell-action",
        type: "smoothstep",
      },
    ],
  },
  RSI_STRATEGY: {
    name: "RSI Strategy",
    description: "RSI-based mean reversion strategy",
    nodes: [
      {
        id: "start",
        type: NodeTypes.START,
        position: { x: 281, y: 0 },
        data: { label: "Start" },
      },
      {
        id: "oversold-condition",
        position: { x: 180, y: 120 },
        type: NodeTypes.CONDITION,
        data: {
          label: "Entry: RSI(14) < 30",
          settings: {
            indicator: "RSI",
            period: 14,
            threshold: 30,
            comparison: "lessThan",
          },
        },
      },
      {
        id: "buy-action",
        position: { x: 580, y: 120 },
        type: NodeTypes.ACTION,
        data: {
          label: "Buy",
          settings: {
            action: "BUY",
            quantity: 1,
            orderType: "LIMIT",
            priceOffset: 0.1,
          },
        },
      },
      {
        id: "overbought-condition",
        position: { x: 180, y: 240 },
        type: NodeTypes.CONDITION,
        data: {
          label: "Exit: RSI(14) > 70",
          settings: {
            indicator: "RSI",
            period: 14,
            threshold: 70,
            comparison: "greaterThan",
          },
        },
      },
      {
        id: "sell-action",
        position: { x: 580, y: 240 },
        type: NodeTypes.ACTION,
        data: {
          label: "Sell",
          settings: {
            action: "SELL",
            quantity: 1,
            orderType: "MARKET",
          },
        },
      },
    ],
    edges: [
      {
        id: "start-entry",
        source: "start",
        target: "oversold-condition",
        type: "smoothstep",
      },
      {
        id: "entry-buy",
        source: "oversold-condition",
        target: "buy-action",
        type: "smoothstep",
      },
      {
        id: "entry-exit",
        source: "oversold-condition",
        target: "overbought-condition",
        type: "smoothstep",
      },
      {
        id: "exit-sell",
        source: "overbought-condition",
        target: "sell-action",
        type: "smoothstep",
      },
    ],
  },
};
