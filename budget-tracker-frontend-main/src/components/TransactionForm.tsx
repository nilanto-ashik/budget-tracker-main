import {
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Spin,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useTransactionStore } from "../store/useTransactionStore";
import { transactionAPI } from "../api/endpoints/transaction";

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  description: string;
  date: string | Date;
}

const TransactionForm: React.FC = () => {
  const TransactionType: string[] = ["Income", "Expense"];

  const [form] = Form.useForm();
  const {
    loading,
    editingTransactions,
    setMode,
    setLoading,
    setEditingTransactions,
  } = useTransactionStore();

  useEffect(() => {
    if (editingTransactions) {
      const formattedTransaction = {
        ...editingTransactions,
        date: editingTransactions.date
          ? dayjs(editingTransactions.date)
          : dayjs(),
      };
      form.setFieldsValue(formattedTransaction);
    }
  }, [editingTransactions, form]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      setLoading(true);
      const formattedValues = {
        _id: editingTransactions?._id,
        type: values.type as string,
        amount: values.amount as number,
        description: values.description as string,
        date: values.date ? dayjs(values.date as string | Date).toISOString() : dayjs().toISOString(),
      };
      if (editingTransactions) {
        await transactionAPI.update(formattedValues._id!, formattedValues as Transaction);
        message.success("Transactions updated successfully");
        setMode("table");
      } else {
        const { _id, ...createData } = formattedValues;
        await transactionAPI.create(createData as Transaction);
        message.success("Transaction created successfully");
        setMode("table");
      }
      setEditingTransactions(null);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <>
        {loading ? (
          <Spin tip="Loading..." size="large" fullscreen />
        ) : (
          <>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Row gutter={16} className="grid-cols-1">
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    name="type"
                    label="Transaction Type"
                    rules={[
                      {
                        required: true,
                        message: "Please select transaction type!",
                      },
                    ]}
                  >
                    <Select showSearch placeholder="Select transaction type">
                      {TransactionType.map((type, index) => (
                        <Select.Option value={type} key={index}>
                          {type}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    name="amount"
                    label="Amount"
                    rules={[
                      {
                        required: true,
                        message: "Please enter amount!",
                      },
                      {
                        type: "number",
                        min: 0.01,
                        message: "Amount must be greater than 0!",
                      },
                    ]}
                  >
                    <Input type="number" min="0.01" step="0.01" placeholder="Enter Amount" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    name="date"
                    label="Date"
                    initialValue={dayjs()}
                    rules={[
                      {
                        required: true,
                        message: "Please select a date!",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY"
                      disabledDate={(current) =>
                        current && current > dayjs().endOf("day")
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span="24">
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                      {
                        required: true,
                        message: "Please enter description!",
                      },
                    ]}
                  >
                    <TextArea
                      rows={3}
                      placeholder="Enter transaction description"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Flex>
                <Space className="mt-3">
                  <Form.Item>
                    <Button
                      className="bg-sky-600 !text-gray-50 hover:!bg-sky-600"
                      htmlType="submit"
                    >
                      Save
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      className="bg-sky-600 !text-gray-50 hover:!bg-sky-600"
                      onClick={() => form.resetFields()}
                    >
                      Reset
                    </Button>
                  </Form.Item>
                </Space>
              </Flex>
            </Form>
          </>
        )}
      </>
    </Card>
  );
};

export default TransactionForm;
