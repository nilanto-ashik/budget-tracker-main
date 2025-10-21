import { LockOutlined, MailOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import { userAPI } from "../api/endpoints/user";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const { setLoading, loading, login, isAuthenticated } = useUserStore();
  const navigate = useNavigate();

  const handelLogin = async (values: any) => {
    try {
      setLoading(true);
      const response = await userAPI.login(values);
      const { accessToken } = response.data;
      login(values, accessToken);
      message.success(response?.message || "Login Success");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <Space className="bg-slate-200/10 w-full h-screen flex justify-center">
      <Card className=" m-2 shadow-sm max-w-md flex justify-center">
        <>
          <Space>
            <Form form={form} layout="vertical" onFinish={handelLogin}>
              <Row gutter={16}>
                <Col xs={24} sm={24}>
                  <Title className="text-center font-mono">Login</Title>
                </Col>
                <Col xs={24} sm={24}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your email!",
                      },
                      {
                        type: "email",
                        message: "Please enter valid email address",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      prefix={
                        <MailOutlined
                          style={{
                            color: "#bfbfbf",
                          }}
                        />
                      }
                      placeholder="Enter your email"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24}>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your password!",
                      },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      prefix={
                        <LockOutlined
                          style={{
                            color: "#bfbfbf",
                          }}
                        />
                      }
                      placeholder="Enter your password"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} className="mt-4">
                  <Button
                    color="primary"
                    variant="solid"
                    htmlType="submit"
                    className="text-base w-full p-5 disabled:bg-blue-300 disabled:text-white"
                    disabled={loading}
                  >
                    {loading ? "Login..." : "Login"}
                  </Button>
                  <Button
                    type="link"
                    className="underline"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot Password?
                  </Button>
                </Col>
                <Col xs={24} sm={24} className="text-center">
                  <span>Don't have an account? </span>
                  <Button
                    type="link"
                    className="p-0 underline"
                    onClick={() => navigate("/register")}
                  >
                    Register Now
                  </Button>
                </Col>
              </Row>
            </Form>
          </Space>
        </>
      </Card>
    </Space>
  );
};

export default LoginForm;
