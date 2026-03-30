// import { Breadcrumb, Button, Flex, Space, Table, Drawer, theme } from 'antd';
// import { PlusOutlined, RightOutlined } from '@ant-design/icons';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { getCategories, createCategory } from '../../http/api';
// import type { Category } from '../../types';
// import CategoryForm from './categoryForm';
// import { useState } from 'react';
// import { Form } from 'antd';

// const Categories = () => {
//     const [form] = Form.useForm();
//     const queryClient = useQueryClient();
//     const [drawerOpen, setDrawerOpen] = useState(false);
//     const { token: { colorBgLayout } } = theme.useToken();

//     const { data: categories, isLoading } = useQuery({
//         queryKey: ['categories'],
//         queryFn: () => getCategories().then(res => res.data)
//     });

//     const { mutate: submitCategory, isPending } = useMutation({
//         mutationFn: (data: Omit<Category, '_id'>) => createCategory(data),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['categories'] });
//             setDrawerOpen(false);
//             form.resetFields();
//         }
//     });

//     const columns = [
//         { 
//             title: 'Category Name', 
//             dataIndex: 'name', 
//             key: 'name' 
//         },
//         { 
//             title: 'Config Count', 
//             key: 'configCount',
//             render: (_: string, record: Category) => 
//                 Object.keys(record.priceConfiguration || {}).length 
//         },
//         { 
//             title: 'Attributes', 
//             key: 'attributesCount',
//             render: (_: string, record: Category) => 
//                 record.attributes?.length || 0 
//         }
//     ];

//     return (
//         <Space direction="vertical" size="large" style={{ width: '100%' }}>
//             <Flex justify="space-between" align="center">
//                 <Breadcrumb 
//                     separator={<RightOutlined />} 
//                     items={[{ title: 'Dashboard' }, { title: 'Categories' }]} 
//                 />
//                 <Button 
//                     type="primary" 
//                     icon={<PlusOutlined />} 
//                     onClick={() => setDrawerOpen(true)}
//                 >
//                     Add Category
//                 </Button>
//             </Flex>

//             <Table 
//                 columns={columns} 
//                 dataSource={categories} 
//                 rowKey="_id" 
//                 loading={isLoading} 
//             />

//             <Drawer
//                 title="Create Category"
//                 width={720}
//                 open={drawerOpen}
//                 destroyOnClose
//                 onClose={() => setDrawerOpen(false)}
//                 styles={{ body: { backgroundColor: colorBgLayout } }}
//                 extra={
//                     <Button type="primary" loading={isPending} onClick={() => form.submit()}>
//                         Submit
//                     </Button>
//                 }
//             >
//                 <CategoryForm form={form} onFinish={(values) => submitCategory(values)} />
//             </Drawer>
//         </Space>
//     );
// };

// export default Categories;