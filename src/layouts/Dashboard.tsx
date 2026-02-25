import React, { useState } from 'react'
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store';
// import { logout } from '../http/api';
import {Flex, Layout, Menu,Badge, theme, Space, Avatar,Dropdown } from 'antd';

import Icon, { BellFilled } from '@ant-design/icons';
import Logo from '../components/icons/logo';
import Home from '../components/icons/Home';
import UserIcon from '../components/UserIcon';
import { foodIcon } from '../components/icons/FoodIcon';
import BasketIcon from '../components/icons/BasketIcon';
import GiftIcon from '../components/icons/GiftIcon';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../http/api';

const { Sider, Header, Content, Footer } = Layout;
 const items=[
        {
            key:"/",
            icon:<Icon component={Home}/>,
            label:<NavLink to="/home">Home</NavLink>
        },
             {
            key:"/users",
            icon:<Icon component={UserIcon}/>,
            label:<NavLink to="/users">Users</NavLink>
        },
          {
            key:"/restraurants",
            icon:<Icon component={foodIcon}/>,
            label:<NavLink to="/restaurants">Restaurants</NavLink>
        },  {
            key:"/promos",
            icon:<Icon component={BasketIcon}/>,
            label:<NavLink to="/promos">Promos</NavLink>
        },  {
            key:"/products",
            icon:<Icon component={GiftIcon}/>,
            label:<NavLink to="/products">Products</NavLink>
        },
    ]


const Dashboard = () => {
    const [collapsed, setCollapsed] =useState(false)
             const {logout: logoutFromStore } = useAuthStore();
     const { mutate: logoutMutate } = useMutation({
            mutationKey: ['logout'],
            mutationFn: logout,
            onSuccess: async () => {
                logoutFromStore();
                return;
            },
        });
  
      const {
    token: { colorBgContainer},
  } = theme.useToken();
   

    const {user}=useAuthStore();
    if(user===null){
        return <Navigate to="/auth/login" replace={true}/>
     
    }

  return (
    <div>
        <Layout style={{ minHeight: '100vh' }}>
      <Sider theme='light' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo" style={{"padding":"20px 30px"}}>
            <Logo/>

            </div>
        <Menu theme="light" defaultSelectedKeys={['/']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ paddingLeft: "16px",paddingRight:"16px", background: colorBgContainer }} 
        >
             <Flex gap="middle" align="start" justify='space-between'>
                <Badge text={user.role=="admin"?"you are an admin":user.tenant?.name}  color="#faad14" status='success' />
                <Space size={16}>
                <Badge  dot={true}>
                    <BellFilled/>
                </Badge>
                    <Dropdown menu={{ items:[
                            {
                                key:"logout",
                                label:"Logout",
                                onClick:()=>logoutMutate()
                            }
                        ] }} placement="bottomRight">
         <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>U</Avatar>
      </Dropdown>

                </Space>


    </Flex>
        </Header>
        <Content style={{ margin: '0 16px' }}>
       <Outlet/>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  
    
    </div>
  )
}

export default Dashboard
