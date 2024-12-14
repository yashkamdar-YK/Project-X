import { Database, BarChart2, Layers, Zap, AlertCircle } from "lucide-react";
import { NodeTypes } from "../_utils/nodeTypes";
import { Edge, Node, Position } from "@xyflow/react";

// Constants for positioning
const SPACING = {
  VERTICAL: 150,    // Space between vertical nodes
  HORIZONTAL: 400,  // Space between condition and action nodes
  START_Y: 0,      // Starting Y position
  START_X: 281,    // Starting X position
  CONDITION_X: 180, // X position for condition nodes
  ACTION_X: 580    // X position for action nodes
};

export const INITIAL_NODES: Node[] = [
  {
    id: "start",
    type: NodeTypes.START,
    position: { x: SPACING.START_X, y: SPACING.START_Y },
    data: { label: "Start" },
  },
  {
    id: "initial-entry",
    position: { x: SPACING.CONDITION_X, y: SPACING.VERTICAL },
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
    sourceHandle: "start-bottom",
    targetHandle: "initial-entry-top",
    type: "conditionEdge",
  },
];

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

export const SIDEBAR_SECTIONS = (onDataPointAdd: (e: any) => void, onIndicatorAdd: (e: any) => void,
  onActionAdd: (e: any) => void, onConditionAdd: (e: any) => void
) => [
    {
      title: "Data Points",
      icon: Database,
      onClick: onDataPointAdd,
    },
    {
      title: "Indicators",
      icon: BarChart2,
      onClick: onIndicatorAdd,
    },
    {
      title: "Actions",
      icon: Zap,
      onClick: onActionAdd,
    },
    {
      title: "Conditions",
      icon: AlertCircle,
      onClick: onConditionAdd,
    },
  {
      title: "Components",
      icon: Layers,
      items: DEFAULT_NODE_TEMPLATES,
      onClick: () => { },
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
        position: { x: SPACING.START_X, y: SPACING.START_Y },
        data: { label: "Start" },
      },
      {
        id: "entry-condition",
        position: { x: SPACING.CONDITION_X, y: SPACING.VERTICAL },
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
      },
      {
        id: "buy-action",
        position: { x: SPACING.ACTION_X, y: SPACING.VERTICAL },
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
        position: { x: SPACING.CONDITION_X, y: SPACING.VERTICAL * 2 },
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
      },
      {
        id: "sell-action",
        position: { x: SPACING.ACTION_X, y: SPACING.VERTICAL * 2 },
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
        sourceHandle: "start-bottom",
        targetHandle: "entry-condition-top",
        type: "conditionEdge",
      },
      {
        id: "entry-buy",
        source: "entry-condition",
        target: "buy-action",
        sourceHandle: "entry-condition-right",
        type: "actionEdge",
      },
      {
        id: "entry-exit",
        source: "entry-condition",
        sourceHandle: "entry-condition-bottom",
        target: "exit-condition",
        targetHandle: "exit-condition-top",
        type: "conditionEdge",
      },
      {
        id: "exit-sell",
        source: "exit-condition",
        target: "sell-action",
        sourceHandle: "exit-condition-right",
        type: "actionEdge",
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
        position: { x: SPACING.START_X, y: SPACING.START_Y },
        data: { label: "Start" },
      },
      {
        id: "oversold-condition",
        position: { x: SPACING.CONDITION_X, y: SPACING.VERTICAL },
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
        position: { x: SPACING.ACTION_X, y: SPACING.VERTICAL },
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
        position: { x: SPACING.CONDITION_X, y: SPACING.VERTICAL * 2 },
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
        position: { x: SPACING.ACTION_X, y: SPACING.VERTICAL * 2 },
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
        sourceHandle: "start-bottom",
        targetHandle: "oversold-condition-top",
        type: "conditionEdge",
      },
      {
        id: "entry-buy",
        source: "oversold-condition",
        target: "buy-action",
        sourceHandle: "oversold-condition-right",
        type: "actionEdge",
      },
      {
        id: "entry-exit",
        source: "oversold-condition",
        sourceHandle: "oversold-condition-bottom",
        target: "overbought-condition",
        targetHandle: "overbought-condition-top",
        type: "conditionEdge",
      },
      {
        id: "exit-sell",
        source: "overbought-condition",
        target: "sell-action",
        sourceHandle: "overbought-condition-right",
        type: "actionEdge",
      },
    ],
  },
};