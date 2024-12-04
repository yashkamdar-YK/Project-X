import { get, post } from "@/lib/axios-factory";

// Define types for the responses
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
    token_type: string;
    user: {
      id: string;
      email: string;
      name: string;
      picture?: string;
    };
  };
}

interface UserProfileResponse {
  status: boolean;
  error: boolean;
  data: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
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
      const response = await get<GoogleAuthCallbackResponse>(`/v1/auth/google/callback?${queryString}`);
      
      if (response.data.status) {
        // Store the access token in localStorage
        localStorage.setItem('token', response.data.data.access_token);
        
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
  }
};