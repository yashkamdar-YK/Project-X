import { post } from "@/lib/axios-factory";

type LoginResponse = {
  access_token: string;
  token_type: string;
};
export const login = async ( email: string, password: string): Promise<LoginResponse> => {
  try {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await post<LoginResponse>("/token/", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "*/*",
      },
      baseURL: "https://apiv.maticalgos.com",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
