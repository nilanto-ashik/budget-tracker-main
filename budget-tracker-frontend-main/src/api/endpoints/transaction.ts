import { api } from "../axios";

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  description: string;
  date: string | Date;
}

interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string;
}

export const transactionAPI = {
  getAll: async (params: {
    search?: string;
  }): Promise<ApiResponse<Transaction[]>> => {
    const response = await api.get("/transactions", { params });
    return response.data;
  },

  create: async (data: Transaction): Promise<ApiResponse<Transaction>> => {
    const response = await api.post("/transactions", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Transaction
  ): Promise<ApiResponse<Transaction>> => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<Transaction>> => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  getAnalytics: async (): Promise<ApiResponse<{
    sepIncomeData: number[];
    sepExpenseData: number[];
    nameIncomeData: string[];
    nameExpenseData: string[];
    totalIncome: number;
    totalExpense: number;
    netAmount: number;
  }>> => {
    const response = await api.get("/transactions/analytics");
    return response.data;
  },
};
