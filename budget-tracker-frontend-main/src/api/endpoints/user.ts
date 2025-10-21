import { api } from "../axios";

interface UsersDataField {
  _id: string;
  name: string;
  email: string;
  password: string;
  accessToken: string;
  message: string;
}

interface UserResponse<T> {
  data: T;
  statusCode: number;
  message: string;
}

export const userAPI = {
  create: async (
    data: { name: string; email: string; password: string }
  ): Promise<UserResponse<UsersDataField>> => {
    return await api.post("/users", data);
  },

  login: async (
    data: { email: string; password: string }
  ): Promise<UserResponse<UsersDataField>> => {
    const response = await api.post("/users/login", data);
    return response.data;
  },

  logout: async () => {
    return await api.post("/users/logout");
  },

  verifyEmail: async (token: string) => {
    return await api.get(`/users/verify-email/${token}`);
  },

  forgotPassword: async (data: { email: string }) => {
    return await api.post(`/users/forgot-password`, data);
  },

  resetPassword: async (token: string | undefined, data: { password: string }) => {
    return await api.post(`/users/reset-password/${token}`, data);
  },
};
