import { Indicator } from "./types";

type CompiledIndicator = {
  name: string;
  indicator: string;
  onData: string;
  columns: string[];
  onEntireData: boolean;
  params: {
    length: number;
    offset?: number | null;
    multiplier?: number;
  };
}

const compileIndicatorsToPayload = (indicators: Indicator[]): CompiledIndicator[] => {
  return indicators.map(indicator => {
    const base = {
      name: indicator.elementName,
      indicator: indicator.type,
      onData: indicator.onData || "",
      //@ts-ignore
      onEntireData: indicator.type == "supertrend" ? false : indicator.settings.source !== "",
    };

    if (indicator.type === "supertrend") {
      return {
        ...base,
        columns: ["high", "low", "close"],
        params: {
          length: parseInt(indicator.settings.length),
          multiplier: parseFloat(indicator.settings.multiplier)
        }
      };
    } else {
      // For EMA and SMA
      return {
        ...base,
        columns: indicator.settings.source ? [indicator.settings.source] : [],
        params: {
          length: parseInt(indicator.settings.length),
          offset: indicator.settings.offset ? parseInt(indicator.settings.offset) : null
        }
      };
    }
  });
};

export default compileIndicatorsToPayload;