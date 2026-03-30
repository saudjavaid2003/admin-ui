import React, { useState } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Flex, Layout, Menu, Badge, theme, Space, Avatar, Dropdown } from 'antd';

import Icon, { BellFilled } from '@ant-design/icons';
import Logo from '../components/icons/logo';
import Home from '../components/icons/Home';
import UserIcon from '../components/UserIcon';
import { foodIcon } from '../components/icons/FoodIcon';
import BasketIcon from '../components/icons/BasketIcon';
import GiftIcon from '../components/icons/GiftIcon';
import CategoryIcon from '../components/icons/CategoryIcon'; 
import { useMutation } from '@tanstack/react-query';
import { logout } from '../http/api';

const { Sider, Header, Content, Footer } = Layout;

const getMenuItems = (role: string) => {
    const baseItems = [
        {
            key: '/',
            icon: <Icon component={Home} />,
            label: <NavLink to="/">Home</NavLink>,
        },
        {
            key: '/categories',
            icon: <Icon component={CategoryIcon} />,
            label: <NavLink to="/categories">Categories</NavLink>,
        },
        {
            key: '/products',
            icon: <Icon component={foodIcon} />,
            label: <NavLink to="/products">Products</NavLink>,
        },
        {
            key: '/orders',
            icon: <Icon component={BasketIcon} />,
            label: <NavLink to="/orders">Orders</NavLink>,
        },
        {
            key: '/promos',
            icon: <Icon component={GiftIcon} />,
            label: <NavLink to="/promos">Promos</NavLink>,
        },
    ];

    if (role === 'admin') {
        const menus = [...baseItems];
        // Users at index 1
        menus.splice(1, 0, {
            key: '/users',
            icon: <Icon component={UserIcon} />,
            label: <NavLink to="/users">Users</NavLink>,
        });
        // Restaurants at index 2
        menus.splice(2, 0, {
            key: '/restaurants',
            icon: <Icon component={foodIcon} />,
            label: <NavLink to="/restaurants">Restaurants</NavLink>,
        });

        return menus;
    }

    return baseItems;
};

const Dashboard = () => {
    const location = useLocation();
    const { logout: logoutFromStore, user } = useAuthStore();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { mutate: logoutMutate } = useMutation({
        mutationKey: ['logout'],
        mutationFn: logout,
        onSuccess: async () => {
            logoutFromStore();
        },
    });

    if (user === null) {
        return <Navigate to={`/auth/login?returnTo=${location.pathname}`} replace={true} />;
    }

    const items = getMenuItems(user.role);

    return (
        <div>
            <Layout style={{ minHeight: '100vh', background: colorBgContainer }}>
                <Sider
                    collapsible
                    theme="light"
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}>
                    <div className="logo" style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                        <Logo />
                    </div>

                    <Menu
                        theme="light"
                        // selectedKeys ensures the sidebar stays highlighted on the current route
                        selectedKeys={[location.pathname]}
                        mode="inline"
                        items={items}
                    />
                </Sider>
                <Layout>
                    <Header
                        style={{
                            paddingLeft: '16px',
                            paddingRight: '16px',
                            background: colorBgContainer,
                        }}>
                        <Flex gap="middle" align="center" justify="space-between" style={{ height: '100%' }}>
                            <Badge
                                text={
                                    user.role === 'admin' ? 'You are an admin' : user.tenant?.name
                                }
                                status="success"
                            />
                            <Space size={16}>
                                <Badge dot={true}>
                                    <BellFilled style={{ fontSize: '18px', cursor: 'pointer' }} />
                                </Badge>
                                <Dropdown
                                    menu={{
                                        items: [
                                            {
                                                key: 'logout',
                                                label: 'Logout',
                                                onClick: () => logoutMutate(),
                                            },
                                        ],
                                    }}
                                    placement="bottomRight">
                                    <Avatar
                                        style={{
                                            backgroundColor: '#fde3cf',
                                            color: '#f56a00',
                                            cursor: 'pointer'
                                        }}>
                                        {user.firstName?.charAt(0).toUpperCase() || 'U'}
                                    </Avatar>
                                </Dropdown>
                            </Space>
                        </Flex>
                    </Header>
                    <Content style={{ margin: '24px' }}>
                        {/* This renders the child components from your router */}
                        <Outlet />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Mernspace pizza shop</Footer>
                </Layout>
            </Layout>
        </div>
    );
};

export default Dashboard;