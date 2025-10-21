import { Space, Typography, Spin, Card, message } from "antd";
import React, { useEffect, useState } from "react";

const { Title } = Typography;

import {
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  Chart as ChartJS,
} from "chart.js";
import { transactionAPI } from "../api/endpoints/transaction";
import { useTransactionStore } from "../store/useTransactionStore";
import AnalyticsCard from "../components/AnalyticsCard";

ChartJS.register(CategoryScale, LinearScale, ArcElement, ChartTooltip, Legend);

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<{
    sepIncomeData: number[];
    sepExpenseData: number[];
    nameIncomeData: string[];
    nameExpenseData: string[];
    totalIncome: number;
    totalExpense: number;
    netAmount: number;
  } | null>(null);

  const { loading, setLoading } = useTransactionStore();

  useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getAnalytics();
      setAnalyticsData(response.data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err?.response?.data?.message || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };
    fetchAnalytics();
  }, [setLoading]);

  function getConsistentColor(index: number): string {
    const colors = [
      "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
      "#FF9F40", "#FF6384", "#C9CBCF", "#4BC0C0", "#FF6384"
    ];
    return colors[index % colors.length];
  }

  const hasData =
    (analyticsData?.sepExpenseData?.length ?? 0) > 0 ||
    (analyticsData?.sepIncomeData?.length ?? 0) > 0;

  return (
    <Space direction="vertical" style={{ width: "100%" }} className="mt-5">
      <Title level={2}>Analytics</Title>
      <Card>
        <div className="flex justify-center items-center flex-wrap gap-10">
          {loading ? (
            <Spin tip="Loading..." size="large" />
          ) : hasData && analyticsData ? (
            <>
              <AnalyticsCard
                title="Income"
                amount={analyticsData.totalIncome}
                type="Income"
                chartData={{
                  labels: analyticsData.nameIncomeData,
                  datasets: [
                    {
                      label: "Income",
                      data: analyticsData.sepIncomeData,
                      backgroundColor: analyticsData.nameIncomeData.map((_: string, index: number) =>
                        getConsistentColor(index)
                      ),
                    },
                  ],
                  hoverOffset: 4,
                }}
              />
              <AnalyticsCard
                title="Expense"
                amount={analyticsData.totalExpense}
                type="Expense"
                chartData={{
                  labels: analyticsData.nameExpenseData,
                  datasets: [
                    {
                      label: "Expense",
                      data: analyticsData.sepExpenseData,
                      backgroundColor: analyticsData.nameExpenseData.map((_: string, index: number) =>
                        getConsistentColor(index)
                      ),
                    },
                  ],
                  hoverOffset: 4,
                }}
              />
              <AnalyticsCard
                title="Total Balance"
                amount={analyticsData.netAmount}
                type="Total Balance"
                chartData={{
                  labels: ["Income", "Expense"],
                  datasets: [
                    {
                      label: "Amount",
                      data: [
                        analyticsData.totalIncome,
                        analyticsData.totalExpense,
                      ],
                      backgroundColor: ["#2ecc71", "#e74c4c"],
                    },
                  ],
                  hoverOffset: 4,
                }}
              />
            </>
          ) : (
            <div>No analytics data available.</div>
          )}
        </div>
      </Card>
    </Space>
  );
};

export default Analytics;
