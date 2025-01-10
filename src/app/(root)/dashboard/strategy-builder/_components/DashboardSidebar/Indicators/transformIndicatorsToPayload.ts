import { Indicator, MovingAverageIndicator, SuperTrendIndicator } from "./types";

interface IndicatorPayload {
  name: string;
  indicator: "ema" | "sma" | "supertrend";
  onData: string;
  onEntireData: boolean;
  columns: string[];
  params: {
    length: number;
    offset?: number;
    multiplier?: number;
  };
}

export const transformIndicatorsToPayload = (
  indicators: Indicator[]
): IndicatorPayload[] => {
  return indicators.map((ind): IndicatorPayload => {
    // Base transformation for all indicators
    const base = {
      name: ind.elementName,
      indicator: ind.type,
      onData: ind.onData || "",
      onEntireData: false,
    };

    // Transform based on indicator type
    switch (ind.type) {
      case "ema":
      case "sma": {
        return {
          ...base,
          columns: [ind.settings.source], // Only include the selected source
          params: {
            length: parseInt(ind.settings.length) || 0,
            offset: parseInt(ind.settings.offset) || 0
          }
        };
      }

      case "supertrend": {
        return {
          ...base,
          // SuperTrend always uses all OHLC columns
          columns: ["high", "low", "close"],
          params: {
            length: parseInt(ind.settings.length) || 0,
            multiplier: parseFloat(ind.settings.multiplier) || 0
          }
        };
      }

      default: {
        // Handle any future indicator types
        const exhaustiveCheck: never = ind;
        throw new Error(`Unhandled indicator type: ${exhaustiveCheck}`);
      }
    }
  });
};

// Example usage with type checks
// export const validateAndTransformIndicators = (
//   indicators: Indicator[]
// ): IndicatorPayload[] => {
//   // Validate required fields
//   const validatedIndicators = indicators.filter(ind => {
//     // Check common required fields
//     if (!ind.elementName || !ind.type || !ind.onData) {
//       console.warn(`Invalid indicator found: missing required fields`, ind);
//       return false;
//     }

//     // Type-specific validation
//     switch (ind.type) {
//       case "ema":
//       case "sma": {
//         const maInd = ind as MovingAverageIndicator;
//         if (!maInd.settings.length || !maInd.settings.source) {
//           console.warn(`Invalid ${ind.type} indicator: missing settings`, ind);
//           return false;
//         }
//         break;
//       }
//       case "supertrend": {
//         const stInd = ind as SuperTrendIndicator;
//         if (!stInd.settings.length || !stInd.settings.multiplier) {
//           console.warn(`Invalid supertrend indicator: missing settings`, ind);
//           return false;
//         }
//         break;
//       }
//     }

//     return true;
//   });

//   return transformIndicatorsToPayload(validatedIndicators);
// };

// // Helper function to transform a single indicator
// export const transformSingleIndicator = (
//   indicator: Indicator
// ): IndicatorPayload => {
//   return transformIndicatorsToPayload([indicator])[0];
// };