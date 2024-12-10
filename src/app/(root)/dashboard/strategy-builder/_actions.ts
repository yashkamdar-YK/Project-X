import { get } from "@/lib/axios-factory";
import {  ApiResponse, DataPointOption, DataType, SymbolData, SymbolInfo } from "./_components/DashboardSidebar/DatapointDialog/types";
import { IndicatorOption } from "./_components/DashboardSidebar/Indicators/types";

export const symbolService = {
  getSymbols: async (search?: string) => {
    try {
      const url = '/v1/builder/symbols' + (search ? `?search=${search}` : '');
      const response = await get<ApiResponse<Record<string, SymbolData>>>(url);
      
      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch symbols');
      }
    } catch (error) {
      throw error;
    }
  },

  getSymbolInfo: async (symbol: string) => {
    try {
      const url = `/v1/builder/symbolinfo?symbol=${symbol}`;
      const response = await get<ApiResponse<SymbolInfo>>(url);
      
      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch symbol info');
      }
    } catch (error) {
      throw error;
    }
  },

  getCandleDataPointsOptions: async (dataType: DataType) => {
    try {
      if(!dataType) throw new Error('Invalid data type');
      const url = `/v1/builder/applydata/candleData?dataType=${dataType}`;
      const response = await get<ApiResponse<DataPointOption>>(url);
      
      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch data points options');
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
        throw new Error(response.data.message || 'Failed to fetch data points options');
      }
    } catch (error) {
      throw error;
    }
  },
  getIndicatorAbility : async (indicatorId: string) => {
    try {
      const url = `v1/builder/setIndc?indc=${indicatorId}`;
      const response = await get<ApiResponse<IndicatorOption>>(url);
      
      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch indicator ability');
      }
    } catch (error) {
      throw error;
    }
  }
};