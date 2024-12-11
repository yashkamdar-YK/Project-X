import { LucideIcon } from "lucide-react";

// API Types
export interface ApiResponse<T> {
  status: boolean;
  error: boolean;
  message: string;
  data: T;
}

export interface SymbolData {
  exchange: string;
}

export interface ExecutionSettings {
  orderType: string[];
  productType: string[];
}

export interface OptExp {
  weekly?: number[];
  monthly: number[];
}

export interface SymbolInfo {
  exchange: string;
  isWeekly: boolean;
  OptExp: OptExp;
  FutExp: {
    monthly: number[];
  };
  tickSize: number;
  executionSettings: ExecutionSettings;
  symbol: string;
  timeFrame: number[];
}

// Data Point Types
export type DataType = "SPOT" | "FUT" | "OPT";
export type SelectedOption = "candle-data" | "days-to-expire" | null;
export type StrikeMode = "strike-at"
export type StrikePosition = "ATM" | `ITM_${number}` | `OTM_${number}`;

export interface StrikeSelection {
  mode: StrikeMode;
  position: StrikePosition;
}

export interface DataPointOption {
  applyIndicators: boolean;
  candleLocation: boolean;
  type: "candleData" | "dte";
  columnsAvailable: string[];
  canComparedwith: ['candleData' , 'values' ,'indicators']
}

export interface DataPoint {
  id: string;
  type: "candle-data" | "days-to-expire";
  elementName: string;
  dataType?: DataType;
  candleType?: string;
  duration?: string;
  expiryType?: string;
  expiryOrder?: string;
  strikeSelection?: StrikeSelection;
  options?: DataPointOption
}

export interface DataPointsStore {
  dataPoints: DataPoint[];
  addDataPoint: (dataPoint: DataPoint) => void;
  removeDataPoint: (id: string) => void;
  updateDataPoint: (id: string, dataPoint: Partial<DataPoint>) => void;
}

export interface DataPointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingDataPoint?: DataPoint;
}

export interface CandleDataFormProps {
  initialData?: DataPoint;
  onSave: (data: {
    elementName: string;
    dataType?: DataType;
    candleType?: string;
    duration?: string;
    expiryType?: string;
    expiryOrder?: string;
    strikeSelection?: StrikeSelection;
  }) => void;
  onClose?: () => void;
}

export interface DaysToExpireProps {
  initialData?: DataPoint;
  onSave: (data: {
    elementName: string;
    expiryType?: string;
    expiryOrder?: string;
  }) => void;
  onClose?: () => void;
}