import React from 'react';
import { Layout, Card, Space, Form, Input, Checkbox, Button, Alert } from 'antd';
import { LockFilled, UserOutlined, LockOutlined } from '@ant-design/icons';
import Logo from '../../components/icons/logo';
import { useMutation,useQuery } from '@tanstack/react-query';
import type { Credentials } from '../../types';
import { login,self,logout} from '../../http/api';
import { useAuthStore } from '../../store';
import { usePermission } from '../../hooks/usePermission';

const LoginUser=async (credentials:Credentials)=>{
console.log(credentials);
const {data}=await login(credentials);
console.log(data);
return data;

}
  const getSelf = async () => {
    const { data } = await self();
    return data;
};
const LoginPage = () => {
   const { isAllowed } = usePermission();
     const { setUser, logout: logoutFromStore } = useAuthStore();

  const {refetch} = useQuery({
        queryKey: ['self'],
        queryFn: getSelf,
        enabled: false,
    });
 const { mutate: logoutMutate } = useMutation({
        mutationKey: ['logout'],
        mutationFn: logout,
        onSuccess: async () => {
            logoutFromStore();
            return;
        },
    });
  
  

 const { mutate,isError,isPending, error } = useMutation({
  mutationKey: ['login'],
  mutationFn: LoginUser,
  onSuccess: async  () => {
  // const selfDataPromise = await refetch();
    const selfDataPromise = await refetch();
            // logout or redirect to client ui
            // window.location.href = "http://clientui/url"
            // "admin", "manager", "customer"
            if (!isAllowed(selfDataPromise.data)) {
                logoutMutate();
                return;
            }
            setUser(selfDataPromise.data);
  // console.log(res.data);
  }
});

  return (
    <Layout style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
      <Space direction="vertical" align="center" size="large">

        <Layout.Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
          <Form
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={(values) => {
              mutate({email:values.username,password:values.password})
            }}
          >
             {isError && (
    <Alert
      style={{ marginBottom: 24 }}
      type="error"
      message={error?.message}
    />
  )}

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
              <a href="#">Forgot password</a>
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
