// Data type abbreviations
const DATA_TYPE_MAP = {
  SPOT: 'spot',
  FUT: 'fut',
  OPT: 'opt'
};

// Candle type abbreviations
const CANDLE_TYPE_MAP = {
  candlestick: 'cs',
  heikenashi: 'ha'
};

// Source abbreviations
const SOURCE_MAP = {
  open: 'o',
  high: 'h',
  low: 'l',
  close: 'c'
};

// Helper for candleData element names
export const generateCandleDataName = (formData: any) => {
  const parts = [];

  // Add data type
  //@ts-ignore
  parts.push(DATA_TYPE_MAP[formData.dataType]?.toLowerCase());

  // Add candle type abbreviation
  //@ts-ignore
  parts.push(CANDLE_TYPE_MAP[formData.candleType]);

  // Add expiry info for FUT and OPT
  if (formData.dataType === 'FUT' || formData.dataType === 'OPT') {
    // e.g., m0 for monthly current, w1 for weekly next
    const expType = formData.expiryType.charAt(0);  // 'm' or 'w'
    const expNo = formData.expiryOrder;  // number
    parts.push(`${expType}${expNo}`);
  }

  // For OPT, add strike selection info
  if (formData.dataType === 'OPT' && formData.strikeSelection) {
    const strikeInfo = formData.strikeSelection.position;
    if (strikeInfo === 'ATM') {
      parts.push('atm');
    } else {
      parts.push(`${strikeInfo}`);
    }
  }

  return parts.filter(Boolean).join('_');
};

// Helper for indicator element names
export const generateIndicatorName = (formData: any, type: 'ema' | 'sma' | 'st') => {
  const parts = [];

  parts.push(formData?.onData || '');
  // Add indicator type (e.g., ema, sma, st)
  parts.push(type);

  // Add source/column for MA indicators
  if (type !== 'st' && formData.settings?.source) {
    //@ts-ignore
    parts.push(SOURCE_MAP[formData.settings.source]);
  }

  // Add period/length
  if (formData.settings?.length) {
    parts.push(formData.settings.length);
  }

  // For SuperTrend, add multiplier
  if (type === 'st' && formData.settings?.multiplier) {
    parts.push(formData.settings.multiplier);
  }

  return parts.filter(Boolean).join('_');
};

// Helper for DTE element names
export const generateDTEName = (formData: any) => {
  // e.g., dte_m0 for monthly current, dte_w1 for weekly next
  const expType = formData.expiryType.charAt(0);  // 'm' or 'w'
  const expNo = formData.expiryOrder;  // number
  return `dte_${expType}${expNo}`;
};