import { BarChart3, Clock, Calculator, Layers, LucideIcon } from "lucide-react";

interface DataPointOption {
  title: string;
  option: string;
  icon: LucideIcon;
  comingSoon?: boolean;
}

export const DATA_POINT_OPTIONS: DataPointOption[] = [
  { title: "Candle Data", option: "candle-data", icon: BarChart3 },
  { title: "Days to Expire", option: "days-to-expire", icon: Clock },
  { title: "Calculate Candle Data", option: "calculate-candle-data", icon: Calculator, comingSoon: true },
  { title: "Synthetic Futures", option: "synthetic-futures", icon: Layers, comingSoon: true },
];

export const EXPIRY_TYPES = ["weekly", "monthly"];
export const EXPIRY_ORDERS = ["first", "second", "third"];

export const CANDLE_TYPES = ["ohlc", "hlc"] as const;
export const DURATION_DAYS = Array.from({length: 10}, (_, i) => i + 1);
export const STRIKE_TYPES = ["ITM", "ATM", "OTM"] as const;
export const ITM_OTM_RANGE = Array.from({length: 10}, (_, i) => i + 1);

export const INDICATOR_OPTIONS = [
  {
    title: "Exponential Moving Average",
    option: "ema",
    icon: Layers,
  },
  {
    title:"Simple Moving Average",
    option: "sma",
    icon: Layers,
  },
  {
    title:"Super Trend",
    option: "supertrend",
    icon: Layers,
  }
]