import { get, post } from "@/lib/axios-factory";
import { ApiResponse } from "../../dashboard/strategy-builder/_components/DashboardSidebar/DatapointDialog/types";

export const myStrategyService = {
  deactivateStrategy: async (strategyName:string , deactivate:boolean=false) => {
    try {
      const response = await post<ApiResponse<any>>(`/v1/strategy/deactivate?strategyName=${strategyName}&deactivate=${deactivate}`);
      if(response.data.status) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to deactivate strategy');
    } catch (error) {
      //@ts-ignore
      throw new Error(error.message ||'Failed to deactivate strategy');
    }
  },
  activateStrategy: async (strategyName:string , runLive:boolean) => {
    try {
      const response = await post<ApiResponse<any>>(`/v1/strategy/activate?strategyName=${strategyName}&runLive=${runLive}`);
      if(response.data.status) {
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      //@ts-ignore
      throw new Error(error.message || 'Failed to activate strategy');
    }
  }
};