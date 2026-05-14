import { Breadcrumb, Flex, Form, Select, Space, Table, Tag, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import type { Order, Tenant } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { getOrders, getTenants } from '../../http/api';
import { format } from 'date-fns';
import { useAuthStore } from '../../store';
import { colorMapping } from '../../constants';
import { capitalizeFirst } from '../products/Helpers';

import React from 'react';

const columns = [
    {
        title: 'Order ID',
        dataIndex: '_id',
        key: '_id',
        render: (_text: string, record: Order) => {
            return <Typography.Text>{record._id}</Typography.Text>;
        },
    },
    {
        title: 'Customer',
        dataIndex: 'customerId',
        key: 'customerId._id',
        render: (_text: string, record: Order) => {
            if (!record.customerId) return '';
            return (
                <Typography.Text>
                    {record.customerId.firstName + ' ' + record.customerId.lastName}
                </Typography.Text>
            );
        },
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        render: (_text: string, record: Order) => {
            return <Typography.Text>{record.address}</Typography.Text>;
        },
    },
    {
        title: 'Comment',
        dataIndex: 'comment',
        key: 'comment',
        render: (_text: string, record: Order) => {
            return <Typography.Text>{record?.comment}</Typography.Text>;
        },
    },
    {
        title: 'Payment Mode',
        dataIndex: 'paymentMode',
        key: 'paymentMode',
        render: (_text: string, record: Order) => {
            return <Typography.Text>{record.paymentMode}</Typography.Text>;
        },
    },
    {
        title: 'Status',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        render: (_: boolean, record: Order) => {
            return (
                <>
                <Tag bordered={false} color={colorMapping[record.orderStatus]}>
                        {capitalizeFirst(record.orderStatus)}
                    </Tag>
                </>
            )
        },
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        render: (text: string) => {
            return <Typography.Text>₹{text}</Typography.Text>;
        },
    },
    {
        title: 'CreatedAt',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => {
            return <Typography.Text>{format(new Date(text), 'dd/MM/yyyy HH:mm')}</Typography.Text>;
        },
    },
    {
        title: 'Actions',
        render: (_: string, record: Order) => {
            return <Link to={`/orders/${record._id}`}>Details</Link>;
        },
    },
];

const Orders = () => {
    const { user } = useAuthStore();

    const [queryParams, setQueryParams] = React.useState({
        tenantId: user!.role === 'manager' ? String(user?.tenant?.id) : undefined,
    });

    const { data: restaurants } = useQuery({
        queryKey: ['restaurants'],
        queryFn: () => getTenants(`perPage=100&currentPage=1`),
        enabled: user!.role === 'admin',
    });

    const { data: orders } = useQuery({
        queryKey: ['orders', queryParams],
        queryFn: () => {
            const filteredParams = Object.fromEntries(
                Object.entries(queryParams).filter(([, v]) => !!v)
            );
            const queryString = new URLSearchParams(
                filteredParams as Record<string, string>
            ).toString();
            return getOrders(queryString).then((res) => res.data);
        },
    });

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Flex justify="space-between">
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Orders' }]}
                />
            </Flex>

            {user!.role === 'admin' && (
                <Form layout="inline">
                    <Form.Item label="Restaurant">
                        <Select
                            style={{ width: 200 }}
                            allowClear
                            placeholder="All restaurants"
                            onChange={(value: string | undefined) =>
                                setQueryParams((prev) => ({ ...prev, tenantId: value }))
                            }>
                            {restaurants?.data.data.map((restaurant: Tenant) => (
                                <Select.Option key={restaurant.id} value={String(restaurant.id)}>
                                    {restaurant.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            )}

            <Table columns={columns} rowKey={'_id'} dataSource={orders} />
        </Space>
    );
};

export default Orders;