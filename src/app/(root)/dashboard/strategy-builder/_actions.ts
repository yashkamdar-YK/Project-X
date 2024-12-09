import { get } from "@/lib/axios-factory";
import {  ApiResponse, SymbolData, SymbolInfo } from "./_components/DashboardSidebar/DatapointDialog/types";

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
  }
};