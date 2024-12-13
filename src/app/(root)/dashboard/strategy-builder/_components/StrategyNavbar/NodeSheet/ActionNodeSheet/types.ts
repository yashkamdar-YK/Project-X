// Existing types remain the same
export type TransactionType = "buy" | "sell";
export type Segment = "OPT" | "FUT" | "CASH";
export type OptionType = "CE" | "PE";
export type ExpirationType = "weekly" | "monthly";

// Target Types
export type TargetSettings = {
  isTarget: boolean;
  targetOn: "%" | "₹";
  targetValue: number;
};

// Stop Loss Types
export type StopLossSettings = {
  isSL: boolean;
  SLon: "%" | "₹";
  SLvalue: number;
};

// Trail Stop Loss Types
export type TrailStopLossSettings = {
  isTrailSL: boolean;
  trailSLon: "%" | "₹";
  trailSL_X: number; // when to trail
  trailSL_Y: number; // how much to trail
};

// Wait Trade Types
export type WaitTradeType = "val-up" | "val-down" | "%val-up" | "%val-down";
export type WaitTradeSettings = {
  isWT: boolean;
  wtVal: number;
  wtOn: WaitTradeType;
};

// Re-entry Types
export type ReEntryMode = "asap" | "asap-rev" | "cost" | "cost-rev";
export type ReEntryTargetSettings = {
  isReEntryTg: boolean;
  reEntryTgOn: ReEntryMode;
  reEntryTgVal: number;
  reEntryTgMaxNo: number; // max 20
};

export type ReEntryStopLossSettings = {
  isReEntrySL: boolean;
  reEntrySLOn: ReEntryMode;
  reEntrySLVal: number;
  reEntrySLMaxNo: number; // max 20
};

// Combined Settings Type
export type PositionSettings = {
  legID: number;
  segment: Segment;
  transactionType: TransactionType;
  optionType?: OptionType;
  qty: number;
  strikeBy: "moneyness";
  strikeVal: number;
  expType: ExpirationType;
  expNo: number;
} & TargetSettings &
  StopLossSettings &
  TrailStopLossSettings &
  WaitTradeSettings &
  ReEntryTargetSettings &
  ReEntryStopLossSettings;

export type Position = {
  id: string;
  type: string;
  settings: PositionSettings;
};