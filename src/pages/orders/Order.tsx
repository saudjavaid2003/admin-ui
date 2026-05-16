import { Breadcrumb, Flex, Form, message, Select, Space, Table, Tag, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import type { Order, Tenant } from '../../types';
import { OrderEvents, PaymentMode, PaymentStatus } from '../../types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrders, getTenants } from '../../http/api';
import { format } from 'date-fns';
import { useAuthStore } from '../../store';
import { colorMapping } from '../../constants';
import { capitalizeFirst } from '../products/Helpers';
import React from 'react';
import socket from '../../lib/socket';

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
            );
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
    const queryClient = useQueryClient();                              // ← added
    const [messageApi, contextHolder] = message.useMessage();        // ← added

    const [queryParams, setQueryParams] = React.useState({
        tenantId: user!.role === 'manager' ? String(user?.tenant?.id) : undefined,
    });

    React.useEffect(() => {
        if (user?.tenant) {
            socket.on('order-update', (data) => {
                // ← teacher's new logic added, your console.log kept
                if (
                    (data.event_type === OrderEvents.ORDER_CREATE &&
                        data.data.paymentMode === PaymentMode.CASH) ||
                    (data.event_type === OrderEvents.PAYMENT_STATUS_UPDATE &&
                        data.data.paymentStatus === PaymentStatus.PAID &&
                        data.data.paymentMode === PaymentMode.CARD)
                ) {
                    queryClient.setQueryData(['orders', queryParams], (old: Order[]) => [data.data, ...old]);
                    messageApi.open({
                        type: 'success',
                        content: 'New Order Received.',
                    });
                }

                console.log('data received: ', data);
            });

            socket.on('join', (data) => {
                console.log('User joined in: ', data.roomId);
            });

            socket.emit('join', {
                tenantId: user.tenant.id,
            });
        }

        return () => {
            socket.off('join');
            socket.off('order-update');
        };
    }, []);

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
        <>
            {contextHolder}
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
        </>
    );
};

export default Orders;