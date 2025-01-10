import { del, get, post, put } from "@/lib/axios-factory";
import {
  ApiResponse,
  DataPointOption,
  DataType,
  SymbolData,
  SymbolInfo,
} from "./_components/DashboardSidebar/DatapointDialog/types";
import { IndicatorOption } from "./_components/DashboardSidebar/Indicators/types";
import { TStrategy } from "../my-strategies/types";
import { TStrategyInfo } from "./_utils/strategyTypes";

export const symbolService = {
  getSymbols: async (search?: string) => {
    try {
      const url = "/v1/builder/symbols" + (search ? `?search=${search}` : "");
      const response = await get<ApiResponse<Record<string, SymbolData>>>(url);

      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch symbols");
      }
    } catch (error) {
      throw error;
    }
  },

  getSymbolInfo: async (symbol: string) => {
    try {
      if(!symbol) return null;
      const url = `/v1/builder/symbolinfo?symbol=${symbol}`;
      const response = await get<ApiResponse<SymbolInfo>>(url);

      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw Error(response.data.message || "Failed to fetch symbol info");
      }
    } catch (error) {
      throw error;
    }
  },

  getCandleDataPointsOptions: async (dataType: DataType) => {
    try {
      if (!dataType) throw new Error("Invalid data type");
      const url = `/v1/builder/applydata/candleData?dataType=${dataType.toLocaleLowerCase()}`;
      const response = await get<ApiResponse<DataPointOption>>(url);

      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch data points options"
        );
      }
    } catch (error) {
      throw error;
    }
  },
  getDTEDataPointsOptions: async () => {
    try {
      const url = `/v1/builder/applydata/DTE`;
      const response = await get<ApiResponse<DataPointOption>>(url);

      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch data points options"
        );
      }
    } catch (error) {
      throw error;
    }
  },
  getIndicatorAbility: async (indicatorId: string) => {
    try {
      const url = `v1/builder/setIndc?indc=${indicatorId}`;
      const response = await get<ApiResponse<IndicatorOption>>(url);

      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch indicator ability"
        );
      }
    } catch (error) {
      throw error;
    }
  },
};

export type TUrlMapping = {
  candle_time: string;
  candle_close_time: string;
  day_week: string;
  day_mtm: string;
  mtm_from_first_open_pos: string;
  open_mtm: string;
  OpenTime?: null | string;
  CloseTime?: null | string;
  action:string
};
export const UrlMapping: TUrlMapping = {
  candle_time: `/v1/builder/applydata/candle_time`,
  candle_close_time: "/v1/builder/applydata/candle_close_time",
  day_week: "/v1/builder/applydata/day_week",
  day_mtm: "/v1/builder/applydata/day_mtm",
  mtm_from_first_open_pos: "/v1/builder/applydata/mtm_from_first_open_pos",
  open_mtm: "/v1/builder/applydata/open_mtm",
  action: "/v1/builder/action-options" //data: string[]
};
export const defaultOptionsService = {
  getTimeIntervalsData: async (interval: number) => {
    return await get<ApiResponse<string[]>>(
      `/v1/builder/applydata/TIME?timevalue=${interval}`
    );
  },
  getCloseTime: async (interval: number) => {
    return await get<ApiResponse<string[]>>(
      `/v1/builder/applydata/closeTime?timevalue=${interval}`
    );
  },
  getApplyData: async (type: keyof TUrlMapping) => {
    //@ts-ignore
    return await get<ApiResponse<DataPointOption >>(UrlMapping[type]);
  },
  getSelectedActionOptions: async (col:string) => {
    return await get<ApiResponse<DataPointOption>>(
      `/v1/builder/action-options/info?option=${col}`
    );
  }
};

export const strategyService = {
  saveSt: async (data: any, saveToSpark: boolean = false) => {
    const response = await post<ApiResponse<any>>(
      `/v1/strategy/Strategy?add_to_spark=${saveToSpark}`,
      {
        ...data,
      }
    );

    if (response.data.status && !response.data.error) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to save strategy");
    }
  },
  getAllSt: async () => {
    const response = await get<ApiResponse<TStrategy[]>>(
      `/v1/strategy/allStrategy`
    );

    if (response.data.status && !response.data.error) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch strategies");
    }
  },
  getStrategy: async (strategyName: string) => {
    const response = await get<ApiResponse<TStrategyInfo>>(
      `/v1/strategy/Strategy?strategyName=${strategyName}`
    );
    if (response.data.status && !response.data.error) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch strategy");
    }
  },
  updateStrategy: async (strategyName: string, data: any) => {
    const response = await put<ApiResponse<any>>(
      `/v1/strategy/Strategy?strategyName=${strategyName}`,
      {
        ...data,
      }
    );

    if (response.data.status && !response.data.error) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to update strategy");
    }
  },
  getStCode: async (strategyName: string) => {
    const response = await get<ApiResponse<{ code: string }>>(
      `/v1/strategy/showcode/?strategyName=${strategyName}`
    );
    if (response.data.status && !response.data.error) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch strategy code");
    }
  },
  deleteSt: async (strategyName: string) => {
    const response = await del<ApiResponse<any>>(
      `/v1/strategy/Strategy?strategyName=${strategyName}`
    );
    if (response.data.status && !response.data.error) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to delete strategy");
    }
  },
  updateStrategyInfo: async (
    strategyName: string,
    data: {
      description: string;
      capitalReq: number;
      visiblity: boolean;
    },
    add_to_spark: boolean = false
  ) => {
    const response = await put<ApiResponse<any>>(
      `/v1/strategy/Strategyinfo?strategyName=${strategyName}&add_to_spark=${add_to_spark}`,
      {
        ...data,
      }
    );

    if (response.data.status && !response.data.error) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || "Failed to update strategy info"
      );
    }
  },
  getPublicStrategies: async () => {
    const response = await get<ApiResponse<TStrategy[]>>(
      `/v1/strategy/all-public-strategy/`
    );

    if (response.data.status && !response.data.error) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || "Failed to fetch public strategies"
      );
    }
  },
  getTemplate: async (templateId: string) =>  {
    const response = await get<ApiResponse<TStrategyInfo>>(
      `/v1/strategy/public-strategy/?strategyID=${templateId}`
    );
    if (response.data.status && !response.data.error) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch template");
    }
  }
};
