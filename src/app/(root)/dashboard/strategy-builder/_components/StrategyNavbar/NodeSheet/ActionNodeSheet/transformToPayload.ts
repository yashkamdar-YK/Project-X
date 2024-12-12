// transformPayload.ts

import { Position, TransactionType, Segment, OptionType, ExpirationType, WaitTradeType, ReEntryMode } from './types';

interface BaseParams {
  transactionType: TransactionType;
  segment: Segment;
  qty: number;
  expType: ExpirationType;
  expNo: number;
  strikeBy: 'moneyness';
  strikeVal: number;
  legID: number;
}

interface OptionParams {
  optionType?: OptionType;
}

interface TargetParams {
  isTarget?: boolean;
  targetOn?: "%" | "₹";
  targetValue?: number;
}

interface StopLossParams {
  isSL?: boolean;
  SLon?: "%" | "₹";
  SLvalue?: number;
}

interface TrailStopLossParams {
  isTrailSL?: boolean;
  trailSLon?: "%" | "₹";
  trailSL_X?: number;
  trailSL_Y?: number;
}

interface WaitTradeParams {
  isWT?: boolean;
  wtVal?: number;
  wtOn?: WaitTradeType;
}

interface ReEntryTargetParams {
  isReEntryTg?: boolean;
  reEntryTgOn?: ReEntryMode;
  reEntryTgVal?: number;
  reEntryTgMaxNo?: number;
}

interface ReEntryStopLossParams {
  isReEntrySL?: boolean;
  reEntrySLOn?: ReEntryMode;
  reEntrySLVal?: number;
  reEntrySLMaxNo?: number;
}

type PositionParams = BaseParams & OptionParams & TargetParams & StopLossParams & 
  TrailStopLossParams & WaitTradeParams & ReEntryTargetParams & ReEntryStopLossParams;

interface ActionPayload {
  func: string;
  params?: PositionParams;
}

export const transformPositionToPayload = (position: Position): ActionPayload => {
  const baseParams: PositionParams = {
    transactionType: position.settings.transactionType,
    segment: position.settings.segment,
    qty: position.settings.qty,
    expType: position.settings.expType,
    expNo: position.settings.expNo,
    strikeBy: 'moneyness',
    strikeVal: position.settings.strikeVal,
    legID: position.settings.legID,
  };

  if (position.settings.segment === 'OPT') {
    baseParams.optionType = position.settings.optionType;
  }

  // Add target settings if enabled
  if (position.settings.isTarget) {
    baseParams.isTarget = true;
    baseParams.targetOn = position.settings.targetOn;
    baseParams.targetValue = position.settings.targetValue;
  }

  // Add stop loss settings if enabled
  if (position.settings.isSL) {
    baseParams.isSL = true;
    baseParams.SLon = position.settings.SLon;
    baseParams.SLvalue = position.settings.SLvalue;
  }

  // Add trail stop loss settings if enabled
  if (position.settings.isTrailSL) {
    baseParams.isTrailSL = true;
    baseParams.trailSLon = position.settings.trailSLon;
    baseParams.trailSL_X = position.settings.trailSL_X;
    baseParams.trailSL_Y = position.settings.trailSL_Y;
  }

  // Add wait trade settings if enabled
  if (position.settings.isWT) {
    baseParams.isWT = true;
    baseParams.wtVal = position.settings.wtVal;
    baseParams.wtOn = position.settings.wtOn;
  }

  // Add re-entry target settings if enabled
  if (position.settings.isReEntryTg) {
    baseParams.isReEntryTg = true;
    baseParams.reEntryTgOn = position.settings.reEntryTgOn;
    baseParams.reEntryTgVal = position.settings.reEntryTgVal;
    baseParams.reEntryTgMaxNo = position.settings.reEntryTgMaxNo;
  }

  // Add re-entry stop loss settings if enabled
  if (position.settings.isReEntrySL) {
    baseParams.isReEntrySL = true;
    baseParams.reEntrySLOn = position.settings.reEntrySLOn;
    baseParams.reEntrySLVal = position.settings.reEntrySLVal;
    baseParams.reEntrySLMaxNo = position.settings.reEntrySLMaxNo;
  }

  return {
    func: 'addLeg',
    params: baseParams
  };
};

interface Action {
  func: string;
}

export const generateActionPayload = (actions: Action[], positions: Position[]): ActionPayload[] => {
  const payload: ActionPayload[] = [];

  // Add regular actions
  for (const action of actions) {
    payload.push({
      func: action.func
    });
  }

  // Add position actions
  for (const position of positions) {
    payload.push(transformPositionToPayload(position));
  }

  return payload;
};