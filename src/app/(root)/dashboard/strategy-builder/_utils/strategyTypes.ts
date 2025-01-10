// strategyTypes.ts

// Base settings type
export interface StrategySettings {
  orderType: string;
  timeframe: number;
  underlying: string;
  productType: string;
  tradingDays: string;
  exitOperation: {
    timeLimit?: number;
    priceBuffer?: number;
    shouldExecute?: boolean;
  };
  squareoffTime: string | null;
  strategy_type: string;
  entryOperation: {
    timeLimit?: number;
    priceBuffer?: number;
    shouldExecute?: boolean;
  };
  tradingDaysList: number[];
}

// Data point types
export interface DataPointOptions {
  applyIndicators: boolean;
  candleLocation: boolean;
  type: string;
  columnsAvailable: string[];
  canComparedwith: string[];
}

export interface DataPointExpiry {
  expNo: number;
  expType: string;
}

export interface DataPointStrikeSelection {
  by: string;
  at: string;
}

export interface DataPointParams {
  exp?: DataPointExpiry;
  dataType: "spot" | "opt" | "fut";
  opType?: "CE" | "PE";
  strike?: DataPointStrikeSelection;
  candleType?: string;
  dataLength: number;
}

export interface DataPoint {
  name: string;
  type: "candleData" | "dte";
  params: DataPointParams;
  options: DataPointOptions;
}

// Indicator types
export interface IndicatorRequirements {
  type: string[];
  minDuration: number;
}

export interface IndicatorOptions {
  requirements: IndicatorRequirements;
  applyIndicators: boolean;
  candleLocation: boolean;
  type: string;
  columnsAvailable: string[];
  canComparedwith: string[];
}

export interface Indicator {
  name: string;
  onData: string;
  params: {
    length: number;
    offset: number;
    multiplier?: number;
  };
  columns: string[];
  indicator: "ema" | "sma" | "supertrend";
  onEntireData: boolean;
  options: IndicatorOptions;
}

// Action types
export interface ActionParams {
  qty?: number;
  expNo?: number;
  legID?: number; 
  expType?: string;
  segment?: string;
  strikeBy?: string;
  targetOn?: string;
  strikeVal?: number;
  optionType?: string;
  targetValue?: number;
  transactionType?: string;
  SLvalue?: number;
  SLon?: string;
  isTrailSL?: boolean;
  trailSL_X?: number;
  trailSL_Y?: number;
  trailSLon?: string;
  wtVal?: number;
  wtOn?: string;
  isReEntryTg?: boolean;
  reEntryTgVal?: number;
  reEntryTgOn?: string;
  reEntryTgMaxNo?: number;
  isReEntrySL?: boolean;
  reEntrySLVal?: number;
  reEntrySLOn?: string;
  reEntrySLMaxNo?: number;
}

export interface Action {
  func: "addLeg" | "squareoff_all" | "stop_WaitTrade_triggers";
  params?: ActionParams;
}

export interface ActionNode {
  act: Action[];
  description: string;
}

// Condition types
export type ConditionOperator =
  | "cross_below"
  | "equals"
  | "is_above"
  | "is_below"
  | "above_or_equal"
  | "below_or_equal"
  | "cross_above";

export type ConditionValue = string | number;

export type ConditionTriplet = [string, ConditionOperator, ConditionValue];

export type ConditionGroup = Array<ConditionTriplet | string>;

export interface Condition {
  node: string;
  type: "entry" | "exit" | "adjustment";
  description: string;
  actions: string[];
  conditions: Array<ConditionGroup | string>;
  maxentries: number;
  check_when_trigger_open: boolean;
  check_when_position_open: boolean;
}

// Node location types
export interface NodeLocation {
  id: string;
  data: {
    label: string;
  };
  type: "START" | "CONDITION" | "ACTION";
  measured?: {
    width: number;
    height: number;
  };
  position: {
    x: number;
    y: number;
  };
  selected?: boolean;
  dragging?: boolean;
  sourcePosition?: string;
  targetPosition?: string;
}

// Edge location types
export interface EdgeLocation {
  id: string;
  type: "conditionEdge" | "actionEdge";
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
  data?: {
    sequence?: number;
    sourceCondition?: string;
  };
}

// Complete strategy info type
export interface TStrategyInfo {
  strategyName: string;
  settings: StrategySettings;
  data: DataPoint[];
  indicators: Indicator[];
  actions: {
    [key: string]: ActionNode;
  };
  conditions: {
    [key: string]: Condition;
  };
  conditions_seq: string[];
  conditions_loc: NodeLocation[];
  actions_loc: EdgeLocation[];
  stratinfo: {
    visiblity: "private" | "public";
    description: string;
    capitalReq: number;
    createdon: string;
    status: string;
  };
}

// Type for strategy list view
export interface TStrategy {
  strategyName: string;
  settings: {
    orderType: string;
    timeframe: number;
    underlying: string;
    productType: string;
    tradingDays: string;
    exitOperation: any;
    squareoffTime: any;
    strategy_type: string;
    entryOperation: any;
    tradingDaysList: any[];
  };
  visiblity: string;
  description: string;
  capitalReq: number;
  createdon: string;
  status: string;
}
