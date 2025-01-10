import { DataPoint } from "./types";

interface DataPointPayload {
  name: string;
  type: "candleData" | "dte";
  params: {
    dataType: "spot" | "fut" | "opt";
    opType?: "CE" | "PE";
    exp?: {
      expType: string;
      expNo: number;
    };
    dataLength: number;
    candleType?: string;
    strike?: {
      by: string;
      at: string;
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
      type: dp.type === "candle-data" ? "candleData" : "dte",
    };

    if (dp.type === "days-to-expire") {
      return {
        ...base,
        type: "dte",
        //@ts-ignore
        params: {
        //@ts-ignore
            expType: dp.expiryType || "",
            expNo: parseInt(dp.expiryOrder || "0"),
        },
      };
    }

    // Handle candle data
    //@ts-ignore
    return {
      ...base,
      params: {
        dataType: dp.dataType?.toLowerCase() as "spot" | "fut" | "opt",
        ...(dp.dataType === "OPT" ? { opType: dp.optionType } : {}),
        ...(dp.dataType !== "SPOT" ? {
          exp: {
            expType: dp.expiryType || "",
            expNo: parseInt(dp.expiryOrder || "0"),
          }
        } : {}),
        dataLength: parseInt(dp.duration || "1"),
        candleType: dp.candleType?.toLowerCase(),
        ...(dp.dataType === "OPT" && dp.strikeSelection
          ? {
            strike: {
              by: dp.strikeSelection.mode,
              at: dp.strikeSelection.position?.toLocaleLowerCase(),
            },
          }
          : {}),
      },
    };
  });
};