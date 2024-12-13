export type IndicatorType = 'ema' | 'sma' | 'supertrend';

export interface BaseIndicator {
  id: string;
  type: IndicatorType;
  elementName: string;
  onData: string | null; // datapoint name
  timeFrame: number;
}

export interface IndicatorOption {
  applyIndicators: boolean;
  candleLocation: boolean;
  type: "candleData" | "dte";
  columnsAvailable: string[];
  canComparedwith: ['candleData' , 'values' ,'indicators']
  requirements:{
    type: ["candleData","indicator"]
    minDuration:number
  }
}

export interface MovingAverageIndicator extends BaseIndicator {
  type: 'ema' | 'sma';
  settings: {
    length: string;
    source: 'high' | 'low' | 'close';
    offset: string;
  };
  options?: IndicatorOption
}

export interface SuperTrendIndicator extends BaseIndicator {
  type: 'supertrend';
  settings: {
    length: string;
    multiplier: string;
  };
  options?: IndicatorOption
}

export type Indicator = MovingAverageIndicator | SuperTrendIndicator;

export interface IndicatorFormData {
  elementName: string;
  onData: string | null;
  settings: {
    length: string;
    source?: 'high' | 'low' | 'close' | 'open' | 'oi' | '';
    offset?: string;
    multiplier?: string;
  };
}

export interface IndicatorStore {
  indicators: Indicator[];
  selectedIndicator: string | null;
  addIndicator: (indicator: Indicator) => void;
  removeIndicator: (id: string) => void;
  setSelectedIndicator: (id: string | null) => void;
  updateIndicator: (id: string, data: Partial<Indicator>) => void;
}