import { DataPoint } from "./types";

interface DataPointPayload {
  name: string;
  type: "candleData" | "DTE";
  params: {
    dataType: "spot" | "fut" | "opt";
    exp: {
      expType: string;
      expNo: number;
    };
    dataLength: number;
    candleType?: string;
    strikeAt?: {
      mode: string;
      position: string;
    };
  };
}

export const transformDataPointsToPayload = (
  dataPoints: DataPoint[]
): DataPointPayload[] => {
  return dataPoints.map((dp): DataPointPayload => {
    // Base transformation for both types
    const base = {
      name: dp.elementName,
      type: dp.type === "candle-data" ? "candleData" : "DTE",
    };

    if (dp.type === "days-to-expire") {
      return {
        ...base,
        type: "DTE",
        params: {
          dataType: "opt", // DTE is always for options
          exp: {
            expType: dp.expiryType || "",
            expNo: parseInt(dp.expiryOrder || "0"),
          },
          dataLength: 1, // DTE always has dataLength 1
        },
      };
    }

    // Handle candle data
    //@ts-ignore
    return {
      ...base,
      params: {
        dataType: dp.dataType?.toLowerCase() as "spot" | "fut" | "opt",
        exp: {
          expType: dp.expiryType || "",
          expNo: parseInt(dp.expiryOrder || "0"),
        },
        dataLength: parseInt(dp.duration || "1"),
        candleType: dp.candleType?.toLowerCase(),
        ...(dp.dataType === "OPT" && dp.strikeSelection
          ? {
              strikeAt: {
                mode: dp.strikeSelection.mode,
                position: dp.strikeSelection.position,
              },
            }
          : {}),
      },
    };
  });
};