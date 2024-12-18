import { useSettingStore } from "@/lib/store/settingStore";

interface SettingsPayload {
  underlying: string;
  strategy_type: "Intraday" | "Positional";
  timeframe: number;
  tradingDays: "all" | "exp" | "days";
  tradingDaysList: number[];
  productType: "Intraday" | "Delivery";
  entryOperation: {
    timeLimit: number;
    shouldExecute: boolean;
    priceBuffer: number;
  } | {};
  exitOperation: {
    timeLimit: number;
    shouldExecute: boolean;
    priceBuffer: number;
  } | {};
  orderType: "Limit" | "Market";
  squareoffTime: string;
}

export const transformSettingsToPayload = (
  underlying: string,
  timeframe: number = 5
): SettingsPayload => {
  const {
    strategyType,
    selectorState,
    selectedDays,
    selectedExp,
    productType,
    orderType,
    squareOffTime,
    entryOperation,
    exitOperation,
  } = useSettingStore.getState();

  // Transform trading days list based on selector state
  const getTradingDaysList = (): number[] => {
    switch (selectorState) {
      case "daily":
        return [];
      case "exp":
        return selectedExp.map(day => -parseInt(day));
      case "days":
        return selectedDays.map(day => {
          const dayMap: Record<string, number> = {
            "Mon": 0,
            "Tue": 1,
            "Wed": 2,
            "Thu": 3,
            "Fri": 4,
          };
          return dayMap[day] || 0;
        });
      default:
        return [];
    }
  };

  // Transform operations by converting string values to numbers
  const transformOperation = (operation: typeof entryOperation) => {
    if (orderType === 'Limit' && operation.shouldExecute) {
      return {
        timeLimit: parseInt(operation.timeLimit) || 0,
        shouldExecute: operation.shouldExecute,
        priceBuffer: parseFloat(operation.priceBuffer) || 0,
      }
    } else {
      return {}
    }
  }

  // Format time to include seconds
  const formatTime = (time: string): string => {
    return time ? `${time}` : "15:30:00"; // Default to market closing time if not set
  };

  return {
    underlying,
    strategy_type: strategyType,
    timeframe,
    tradingDays: selectorState === "daily" ? "all" : selectorState === "exp" ? "exp" : "days",
    tradingDaysList: getTradingDaysList(),
    productType,
    entryOperation: transformOperation(entryOperation),
    exitOperation: transformOperation(exitOperation),
    orderType,
    squareoffTime: formatTime(squareOffTime),
  };
};