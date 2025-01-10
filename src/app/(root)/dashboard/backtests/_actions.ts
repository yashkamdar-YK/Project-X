import { del, get, post, put } from "@/lib/axios-factory";
import { ApiResponse } from "../strategy-builder/_components/DashboardSidebar/DatapointDialog/types";
import { TBacktest, TBacktestResult } from "./type";
import { TPublicBacktestdata } from "../../backtest/[encr]/_type";

export const backtestService = {
  startBacktest: async (
    strategyName: string,
    startDate: string,
    endDate: string
  ) => {
    try {
      const url = "/v1/strategy/backtest/?strategyName=" + strategyName;
      const response = await post<ApiResponse<any>>(url, {
        startDate: startDate,
        endDate: endDate,
        visiblity: "private",
      });

      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch symbols");
      }
    } catch (error) {
      throw error;
    }
  },
  getBacktests: async () => {
    try {
      const url = "/v1/strategy/backtest/";
      const response = await get<ApiResponse<TBacktest[]>>(url);

      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch symbols");
      }
    } catch (error) {
      throw error;
    }
  },
  getBackTestDurationLimit: async (symbol: string) => {
    try {
      const url = "/v1/strategy/backtest/duration?symbol=" + symbol;
      const response = await get<
        ApiResponse<{
          startDate: string;
          endDate: string;
        }>
      >(url);

      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch symbols");
      }
    } catch (error) {
      throw error;
    }
  },
  getBackTestResults: async (
    stangleTBSpos: string,
    runid: string,
    slippage: number
  ) => {
    try {
      const url =
        "/v1/strategy/backtest/metrics?strategyName=" +
        stangleTBSpos +
        "&runid=" +
        runid +
        "&slippage=" +
        slippage;
      const response = await get<ApiResponse<TBacktestResult>>(url);

      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch symbols");
      }
    } catch (error) {
      throw error;
    }
  },
  deleteBacktest: async (strategyName: string, runid: string) => {
    try {
      const url = "/v1/strategy/backtest/?strategyName=" + strategyName + "&runid=" + runid;
      const response = await del<ApiResponse<any>>(url);

      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch symbols");
      }
    } catch (error) {
      throw error;
    }
  },
  changeVisibility: async (strategyName: string, runid: string, visibility: 'public' | 'private') => {
    try {
      const url = `/v1/strategy/backtest/visiblity?strategyName=${strategyName}&runid=${runid}&visiblity=${visibility}`;
      const response = await get<ApiResponse<{"visiblity": string}>>(url);

      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch symbols");
      }
    }
    catch (error) {
      throw error;
    }
  },
  generatePublicURL: async (strategyName: string, runId: string) => {
    try {
      const url = `/v1/strategy/url/public-backtest/?strategyName=${strategyName}&runId=${runId}`;
      const response = await get<ApiResponse<{encr: string;}>>(url);

      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch symbols");
      }
    } catch (error) {
      throw error;
    }
  },
  getPublicBacktest: async (encr: string, slippage:number=0) => {
    try {
      const url = `/v1/strategy/public-backtest/?encr=${encr}&slippage=${slippage}`;
      const response = await get<ApiResponse<TPublicBacktestdata>>(url);

      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch symbols");
      }
    }
    catch (error) {
      throw error;
    }
  },
  getPublicBacktestStrategyRules: async (encr: string) => {
    try {
      const url = `/v1/strategy/public-backtest/rules?encr=${encr}`;
      const response = await get<ApiResponse<any>>(url);

      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch symbols");
      }
    }
    catch (error) {
      throw error;
    }
  }
};
