import React from 'react';
import { Layout, Card, Space, Form, Input, Checkbox, Button } from 'antd';
import { LockFilled, UserOutlined, LockOutlined } from '@ant-design/icons';
import Logo from '../../components/icons/logo';

const LoginPage = () => {
  const isPending = false; // Remove or replace with your state if needed

  return (
    <Layout style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
      <Space direction="vertical" align="center" size="large">
        <Layout.Content
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Logo />
        </Layout.Content>

        <Card
          bordered={false}
          style={{ width: 300 }}
          title={
            <Space style={{ width: '100%', fontSize: 16, justifyContent: 'center' }}>
              <LockFilled />
              Sign in
            </Space>
          }
        >
          <Form layout="vertical"    initialValues={{
                                remember: true,
                            }}>
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="#" id="login-form-forgot">
                Forgot password
              </a>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={isPending}>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </Layout>
  );
};

export default LoginPage;
