import { get } from "@/lib/axios-factory";

interface SymbolData {
  exchange: string;
}

interface SymbolSearchResponse {
  status: boolean;
  error: boolean;
  message: string;
  data: {
    [key: string]: SymbolData;
  };
}

export const symbolService = {
  getSymbols: async (search?: string) => {
    try {
      const url = '/v1/builder/symbols' + (search ? `?search=${search}` : '');
      const response = await get<SymbolSearchResponse>(url);
      
      if (response.data.status && !response.data.error) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch symbols');
      }
    } catch (error) {
      throw error;
    }
  }
};