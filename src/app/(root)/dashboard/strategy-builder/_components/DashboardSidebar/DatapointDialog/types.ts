import { LucideIcon } from "lucide-react";

export type DataType = "SPOT" | "FUT" | "OPT";
export type SelectedOption = "candle-data" | "days-to-expire" | "calculate-candle-data" | "synthetic-futures" | null;
export type StrikeMode = "at" | "near";
export type StrikePosition = "ATM" | `ITM_${number}` | `OTM_${number}`;

export interface StrikeSelection {
  mode: StrikeMode;
  position: StrikePosition;
}

export interface DataPointOption {
  title: string;
  option: string;
  icon: LucideIcon;
  comingSoon?: boolean;
}

// export interface DataPointDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

export interface DataPointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDataPoint?: DataPoint | null;
}

export interface InitialOptionsProps {
  onSelect: (option: SelectedOption) => void;
  filteredOptions: DataPointOption[];
}

export type StrikeType = "ITM" | "ATM" | "OTM";
export type CandleType = "ohlc" | "hlc";

export interface CandleDataFormProps {
  dataType: DataType;
  setDataType: (type: DataType) => void;
  onGenerateElementName: () => void;
  elementName: string;
}

export interface DataPoint {
  id: string;
  type: "candle-data" | "days-to-expire";
  dataType?: DataType;  // SPOT, FUT, OPT
  candleType?: string;
  duration?: string;
  expiryType?: string;
  expiryOrder?: string;
  strikeSelection?: StrikeSelection;
  elementName: string;
}

export interface DataPointsStore {
  dataPoints: DataPoint[];
  selectedDataPoint: string | null;
  addDataPoint: (dataPoint: DataPoint) => void;
  removeDataPoint: (id: string) => void;
  setSelectedDataPoint: (id: string | null) => void;
  updateDataPoint: (id: string, dataPoint: Partial<DataPoint>) => void;
}

