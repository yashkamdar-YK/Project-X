import { Action, useActionStore } from '@/lib/store/actionStore';
import { Position, PositionSettings } from './types';

interface BaseParams {
  transactionType: 'buy' | 'sell';
  segment: 'OPT' | 'FUT' | 'CASH';
  qty: number;
  expType: 'weekly' | 'monthly';
  expNo: number;
  strikeBy: 'moneyness';
  strikeVal: number;
  legID: number;
}

interface ActionPayload {
  func: string;
  params?: Partial<PositionSettings>;
}

export const transformToActionPayload = (actions: Action[], positions: Position[]): ActionPayload[] => {
  const payload: ActionPayload[] = [];

  // Add regular actions (squareoff_all, stop_WaitTrade_triggers)
  actions.forEach(action => {
    payload.push({ func: action.func });
  });

  // Transform positions
  positions.forEach(position => {
    const { settings } = position;
    
    // Start with base params that are always required
    const params: Partial<PositionSettings> = {
      transactionType: settings.transactionType,
      segment: settings.segment,
      qty: settings.qty,
      expType: settings.expType,
      expNo: settings.expNo,
      strikeBy: 'moneyness',
      strikeVal: settings.strikeVal,
      legID: settings.legID,
    };

    // Add optionType only for OPT segment
    if (settings.segment === 'OPT' && settings.optionType) {
      params.optionType = settings.optionType;
    }

    // Add Target settings if enabled
    if (settings.isTarget) {
      params.isTarget = true;
      params.targetOn = settings.targetOn;
      params.targetValue = settings.targetValue;
    }

    // Add Stop Loss settings if enabled
    if (settings.isSL) {
      params.isSL = true;
      params.SLon = settings.SLon;
      params.SLvalue = settings.SLvalue;
    }

    // Add Trail Stop Loss settings if enabled
    if (settings.isTrailSL) {
      params.isTrailSL = true;
      params.trailSLon = settings.trailSLon;
      params.trailSL_X = settings.trailSL_X;
      params.trailSL_Y = settings.trailSL_Y;
    }

    // Add Wait Trade settings if enabled
    if (settings.isWT) {
      params.isWT = true;
      params.wtOn = settings.wtOn;
      params.wtVal = settings.wtVal;
    }

    // Add Re-Entry Target settings if enabled
    if (settings.isReEntryTg) {
      params.isReEntryTg = true;
      params.reEntryTgOn = settings.reEntryTgOn;
      params.reEntryTgVal = settings.reEntryTgVal;
      params.reEntryTgMaxNo = settings.reEntryTgMaxNo;
    }

    // Add Re-Entry Stop Loss settings if enabled
    if (settings.isReEntrySL) {
      params.isReEntrySL = true;
      params.reEntrySLOn = settings.reEntrySLOn;
      params.reEntrySLVal = settings.reEntrySLVal;
      params.reEntrySLMaxNo = settings.reEntrySLMaxNo;
    }

    payload.push({
      func: 'addLeg',
      params
    });
  });

  return payload;
};