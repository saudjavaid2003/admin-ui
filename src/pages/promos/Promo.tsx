// src/pages/promos/Promos.tsx
import {
    DeleteOutlined,
    PlusOutlined,
    SafetyCertificateOutlined,
    TagsOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    DatePicker,
    Drawer,
    Form,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Statistic,
    Table,
    Tag,
    Typography,
    message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useState } from 'react';
import { createCoupon, deleteCoupon, getCoupons, getTenants, verifyCoupon } from '../../http/api';
import { useAuthStore } from '../../store';
import type { Coupon, CreateCouponData, VerifyCouponResponse } from '../../types';

const { Title, Text } = Typography;

// Form uses Dayjs for the date picker; we convert to ISO string before sending to API
type CreateCouponFormValues = Omit<CreateCouponData, 'validUpto'> & { validUpto: dayjs.Dayjs };

const isExpired = (date: string) => dayjs().isAfter(dayjs(date));

const Promos = () => {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();

    const isAdmin = user?.role === 'admin';
    const isManager = user?.role === 'manager';
    const canCreate = isAdmin || isManager;

    // drawer state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [createForm] = Form.useForm<CreateCouponFormValues>();

    // verify modal state
    const [verifyOpen, setVerifyOpen] = useState(false);
    const [verifyForm] = Form.useForm<{ code: string; tenantId: number }>();
    const [verifyResult, setVerifyResult] = useState<VerifyCouponResponse | null>(null);

    // ── queries ───────────────────────────────────────────────────
    const tenantId = isAdmin ? undefined : user?.tenant?.id;

    const { data: couponsData, isLoading } = useQuery({
        queryKey: ['coupons', tenantId],
        queryFn: async () => {
            const qs = tenantId ? `tenantId=${tenantId}` : '';
            const { data } = await getCoupons(qs);
            return data as Coupon[];
        },
    });

    const { data: tenantsData } = useQuery({
        queryKey: ['tenants-select'],
        queryFn: async () => {
            const { data } = await getTenants('');
            return data?.data ?? [];
        },
        enabled: isAdmin,
    });

    // ── mutations ─────────────────────────────────────────────────
    const { mutate: createMutate, isPending: creating } = useMutation({
        mutationFn: (values: CreateCouponData) => createCoupon(values),
        onSuccess: () => {
            messageApi.success('Coupon created successfully!');
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
            setDrawerOpen(false);
            createForm.resetFields();
        },
        onError: () => {
            messageApi.error('Failed to create coupon. Please try again.');
        },
    });

    const { mutate: deleteMutate } = useMutation({
        mutationFn: (id: string) => deleteCoupon(id),
        onSuccess: () => {
            messageApi.success('Coupon deleted.');
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
        },
        onError: () => {
            messageApi.error('Failed to delete coupon.');
        },
    });

    const { mutate: verifyMutate, isPending: verifying } = useMutation({
        mutationFn: verifyCoupon,
        onSuccess: ({ data }: { data: VerifyCouponResponse }) => {
            setVerifyResult(data);
        },
        onError: () => {
            setVerifyResult({ valid: false, discount: 0 });
        },
    });

    // ── handlers ──────────────────────────────────────────────────
    const handleCreate = (values: CreateCouponFormValues) => {
        const payload: CreateCouponData = {
            ...values,
            validUpto: values.validUpto.toISOString(),
            tenantId: isAdmin ? values.tenantId : (user?.tenant?.id as number),
        };
        createMutate(payload);
    };

    const handleVerify = (values: { code: string; tenantId: number }) => {
        setVerifyResult(null);
        verifyMutate({ code: values.code, tenantId: values.tenantId });
    };

    // ── open verify modal — pre-fill tenantId for managers ────────
    const openVerifyModal = () => {
        setVerifyResult(null);
        verifyForm.resetFields();
        if (isManager && user?.tenant?.id) {
            verifyForm.setFieldsValue({ tenantId: user.tenant.id });
        }
        setVerifyOpen(true);
    };

    // ── stats ─────────────────────────────────────────────────────
    const coupons = couponsData ?? [];
    const activeCoupons = coupons.filter((c) => !isExpired(c.validUpto)).length;
    const expiredCoupons = coupons.filter((c) => isExpired(c.validUpto)).length;

    // ── table columns ─────────────────────────────────────────────
    const columns: ColumnsType<Coupon> = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            render: (code: string) => (
                <Tag
                    color="blue"
                    style={{ fontFamily: 'monospace', fontSize: 13, letterSpacing: 1 }}>
                    {code}
                </Tag>
            ),
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
            render: (discount: number) => (
                <Text type="success" strong>
                    {discount}% OFF
                </Text>
            ),
        },
        {
            title: 'Valid Until',
            dataIndex: 'validUpto',
            key: 'validUpto',
            render: (date: string) => (
                <Space>
                    <Text>{dayjs(date).format('DD MMM YYYY')}</Text>
                    {isExpired(date) ? (
                        <Badge status="error" text="Expired" />
                    ) : (
                        <Badge status="success" text="Active" />
                    )}
                </Space>
            ),
        },
        ...(isAdmin
            ? [
                  {
                      title: 'Restaurant',
                      dataIndex: 'tenantId',
                      key: 'tenantId',
                      render: (id: number) => {
                          const tenant = tenantsData?.find(
                              (t: { id: number; name: string }) => t.id === id,
                          );
                          return <Tag>{tenant?.name ?? `#${id}`}</Tag>;
                      },
                  },
              ]
            : []),
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => (
                <Text type="secondary">{dayjs(date).format('DD MMM YYYY')}</Text>
            ),
        },
        ...(canCreate
            ? [
                  {
                      title: 'Action',
                      key: 'action',
                      render: (_: unknown, record: Coupon) => (
                          <Popconfirm
                              title="Delete this coupon?"
                              description="This action cannot be undone."
                              okText="Delete"
                              okButtonProps={{ danger: true }}
                              onConfirm={() => deleteMutate(record._id)}>
                              <Button
                                  type="text"
                                  danger
                                  icon={<DeleteOutlined />}
                                  size="small"
                              />
                          </Popconfirm>
                      ),
                  },
              ]
            : []),
    ];

    // ── render ────────────────────────────────────────────────────
    return (
        <>
            {contextHolder}

            <Space direction="vertical" size={24} style={{ width: '100%' }}>
                {/* Page header */}
                <Row justify="space-between" align="middle">
                    <Col>
                        <Space align="center">
                            <TagsOutlined style={{ fontSize: 24, color: '#1677ff' }} />
                            <Title level={3} style={{ margin: 0 }}>
                                Promos & Coupons
                            </Title>
                        </Space>
                    </Col>
                    {canCreate && (
                        <Col>
                            <Space>
                                <Button
                                    icon={<SafetyCertificateOutlined />}
                                    onClick={openVerifyModal}>
                                    Verify Coupon
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setDrawerOpen(true)}>
                                    New Coupon
                                </Button>
                            </Space>
                        </Col>
                    )}
                </Row>

                {/* Stats cards */}
                <Row gutter={16}>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic title="Total Coupons" value={coupons.length} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Active"
                                value={activeCoupons}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Expired"
                                value={expiredCoupons}
                                valueStyle={{ color: '#ff4d4f' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Main table */}
                <Card>
                    <Table<Coupon>
                        rowKey="_id"
                        columns={columns}
                        dataSource={coupons}
                        loading={isLoading}
                        pagination={{ pageSize: 10, showSizeChanger: true }}
                        locale={{ emptyText: 'No coupons found. Create your first one!' }}
                    />
                </Card>
            </Space>

            {/* ── Create Coupon Drawer ──────────────────────────────── */}
            <Drawer
                title="Create New Coupon"
                width={480}
                open={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    createForm.resetFields();
                }}
                extra={
                    <Button type="primary" loading={creating} onClick={() => createForm.submit()}>
                        Create
                    </Button>
                }>
                <Form
                    form={createForm}
                    layout="vertical"
                    onFinish={handleCreate}
                    requiredMark="optional">
                    <Form.Item
                        name="title"
                        label="Coupon Title"
                        rules={[{ required: true, message: 'Please enter a title' }]}>
                        <Input placeholder="e.g. Summer Sale 20%" />
                    </Form.Item>

                    <Form.Item
                        name="code"
                        label="Coupon Code"
                        rules={[
                            { required: true, message: 'Please enter a code' },
                            {
                                pattern: /^[A-Z0-9_-]+$/,
                                message: 'Use uppercase letters, numbers, _ or - only',
                            },
                        ]}>
                        <Input
                            placeholder="e.g. SUMMER20"
                            style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
                            onChange={(e) =>
                                createForm.setFieldValue('code', e.target.value.toUpperCase())
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name="discount"
                        label="Discount (%)"
                        rules={[
                            { required: true, message: 'Please enter a discount value' },
                            {
                                type: 'number',
                                min: 1,
                                max: 100,
                                message: 'Must be between 1–100',
                            },
                        ]}>
                        <InputNumber
                            min={1}
                            max={100}
                            addonAfter="%"
                            style={{ width: '100%' }}
                            placeholder="20"
                        />
                    </Form.Item>

                    <Form.Item
                        name="validUpto"
                        label="Valid Until"
                        rules={[
                            { required: true, message: 'Please select an expiry date' },
                            {
                                validator: (_, value) =>
                                    value && dayjs().isBefore(value)
                                        ? Promise.resolve()
                                        : Promise.reject('Date must be in the future'),
                            },
                        ]}>
                        <DatePicker
                            style={{ width: '100%' }}
                            format="DD MMM YYYY"
                            disabledDate={(d) => d && d.isBefore(dayjs())}
                        />
                    </Form.Item>

                    {isAdmin && (
                        <Form.Item
                            name="tenantId"
                            label="Restaurant"
                            rules={[{ required: true, message: 'Please select a restaurant' }]}>
                            <Select
                                showSearch
                                placeholder="Select restaurant"
                                optionFilterProp="label"
                                options={tenantsData?.map(
                                    (t: { id: number; name: string }) => ({
                                        value: t.id,
                                        label: t.name,
                                    }),
                                )}
                            />
                        </Form.Item>
                    )}
                </Form>
            </Drawer>

            {/* ── Verify Coupon Modal ───────────────────────────────── */}
            <Modal
                title="Verify Coupon"
                open={verifyOpen}
                onCancel={() => {
                    setVerifyOpen(false);
                    setVerifyResult(null);
                    verifyForm.resetFields();
                }}
                footer={null}
                width={440}>
                <Form
                    form={verifyForm}
                    layout="vertical"
                    onFinish={handleVerify}
                    style={{ marginTop: 16 }}>
                    <Form.Item
                        name="code"
                        label="Coupon Code"
                        rules={[{ required: true, message: 'Enter a coupon code' }]}>
                        <Input
                            placeholder="e.g. SUMMER20"
                            style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
                            onChange={(e) =>
                                verifyForm.setFieldValue('code', e.target.value.toUpperCase())
                            }
                        />
                    </Form.Item>

                    {isAdmin && (
                        <Form.Item
                            name="tenantId"
                            label="Restaurant"
                            rules={[{ required: true, message: 'Select a restaurant' }]}>
                            <Select
                                showSearch
                                placeholder="Select restaurant"
                                optionFilterProp="label"
                                options={tenantsData?.map(
                                    (t: { id: number; name: string }) => ({
                                        value: t.id,
                                        label: t.name,
                                    }),
                                )}
                            />
                        </Form.Item>
                    )}

                    {/* Hidden field for managers — value set via setFieldsValue on modal open */}
                    {isManager && (
                        <Form.Item name="tenantId" hidden>
                            <InputNumber />
                        </Form.Item>
                    )}

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={verifying}
                            icon={<SafetyCertificateOutlined />}
                            block>
                            Verify
                        </Button>
                    </Form.Item>
                </Form>

                {verifyResult !== null && (
                    <Alert
                        message={
                            verifyResult.valid
                                ? `✅ Valid Coupon — ${verifyResult.discount}% discount`
                                : '❌ Invalid or Expired Coupon'
                        }
                        type={verifyResult.valid ? 'success' : 'error'}
                        showIcon
                        style={{ marginTop: 8 }}
                    />
                )}
            </Modal>
        </>
    );
};

export default Promos;
