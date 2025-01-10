import { get, post } from "@/lib/axios-factory";
import { UserProfile } from "@/lib/store/authStore";
import { setCookie } from "cookies-next";
import { ApiResponse } from "../../dashboard/strategy-builder/_components/DashboardSidebar/DatapointDialog/types";

interface GoogleLoginUrlResponse {
  status: boolean;
  error: boolean;
  message: string;
  data: {
    url: string;
  };
}

interface GoogleAuthCallbackResponse {
  status: boolean;
  error: boolean;
  message: string;
  data: {
    access_token: string;
  };
}
interface UserProfileResponse {
  status: boolean;
  error: boolean;
  data: UserProfile
}

export const authService = {
  // Get Google Login URL
  getGoogleLoginUrl: async () => {
    try {
      const response = await get<GoogleLoginUrlResponse>('/v1/auth/google/loginurl');
      return response.data.data.url;
    } catch (error) {
      throw new Error('Failed to fetch Google login URL');
    }
  },

  // Handle Google Callback
  handleGoogleCallback: async (queryString: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      const response = await get<GoogleAuthCallbackResponse>(`/v1/auth/google/callback?${queryString}`);
      
      if (response.data.status) {
        setCookie('token', response.data.data.access_token,)
        
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Authentication failed');
      }
    } catch (error) {
      throw error;
    }
  },

  // Get User Profile
  getProfile: async () => {
    try {
      const response = await get<UserProfileResponse>('/v1/profile');
      
      if (response.data.status) {
        return response.data.data;
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      throw error;
    }
  },

  sparkCallBack: async (code: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      const response = await get<ApiResponse<{
        access_token:string
      }>>('/v1/auth/spark/callback?code=' + code);

      if (response.data.status) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Authentication failed');
      }

    } catch (error) {
      throw error;
    }
  }
};