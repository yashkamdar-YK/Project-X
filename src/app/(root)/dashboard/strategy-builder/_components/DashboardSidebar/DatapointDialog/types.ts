import { LucideIcon } from "lucide-react";

export type DataType = "SPOT" | "FUT" | "OPT";
export type SelectedOption = "candle-data" | "days-to-expire" | "calculate-candle-data" | "synthetic-futures" | null;

export interface DataPointOption {
  title: string;
  option: string;
  icon: LucideIcon;
  comingSoon?: boolean;
}

export interface DataPointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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