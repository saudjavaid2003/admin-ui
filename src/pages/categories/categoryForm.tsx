// import { Card, Form, Input, Select, Button, Space, Divider, Row, Col,type  FormInstance } from 'antd';
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
// import type { Category, PriceConfiguration, Attribute } from '../../types';

// interface PriceConfigField {
//     key: string;
//     priceType: 'base' | 'aditional';
//     options: string[];
// }

// interface FormValues {
//     name: string;
//     priceConfigs: PriceConfigField[];
//     attributes: Attribute[];
// }

// interface CategoryFormProps {
//     form: FormInstance;
//     onFinish: (values: Omit<Category, '_id'>) => void;
// }

// const CategoryForm = ({ form, onFinish }: CategoryFormProps) => {
    
//     const handleSubmit = (values: FormValues) => {
//         // Transform the flat array into the Record<string, T> Map structure
//         const formattedPriceConfig = values.priceConfigs.reduce<PriceConfiguration>((acc, curr) => {
//             acc[curr.key] = {
//                 priceType: curr.priceType,
//                 availableOptions: curr.options
//             };
//             return acc;
//         }, {});

//         onFinish({
//             name: values.name,
//             priceConfiguration: formattedPriceConfig,
//             attributes: values.attributes || []
//         });
//     };

//     return (
//         <Form form={form} layout="vertical" onFinish={handleSubmit}>
//             <Card title="General Info" style={{ marginBottom: 20 }}>
//                 <Form.Item name="name" label="Category Name" rules={[{ required: true, message: 'Please enter category name' }]}>
//                     <Input placeholder="e.g. Pizza" />
//                 </Form.Item>
//             </Card>

//             <Card title="Price Configurations (Sizes, Crusts, etc.)" style={{ marginBottom: 20 }}>
//                 <Form.List name="priceConfigs">
//                     {(fields, { add, remove }) => (
//                         <>
//                             {fields.map(({ key, name, ...restField }) => (
//                                 <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
//                                     <Form.Item {...restField} name={[name, 'key']} rules={[{ required: true, message: 'Missing key' }]}>
//                                         <Input placeholder="Key (e.g. Size)" />
//                                     </Form.Item>
//                                     <Form.Item {...restField} name={[name, 'priceType']} rules={[{ required: true }]}>
//                                         <Select placeholder="Type" style={{ width: 120 }}>
//                                             <Select.Option value="base">Base</Select.Option>
//                                             <Select.Option value="aditional">Additional</Select.Option>
//                                         </Select>
//                                     </Form.Item>
//                                     <Form.Item {...restField} name={[name, 'options']} rules={[{ required: true }]}>
//                                         <Select mode="tags" style={{ width: 250 }} placeholder="Options (Press Enter)" />
//                                     </Form.Item>
//                                     <MinusCircleOutlined onClick={() => remove(name)} />
//                                 </Space>
//                             ))}
//                             <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
//                                 Add Price Config
//                             </Button>
//                         </>
//                     )}
//                 </Form.List>
//             </Card>

//             <Card title="Attributes (Spicy, Toppings, etc.)">
//                 <Form.List name="attributes">
//                     {(fields, { add, remove }) => (
//                         <>
//                             {fields.map(({ key, name, ...restField }) => (
//                                 <div key={key} style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 16 }}>
//                                     <Row gutter={16}>
//                                         <Col span={8}>
//                                             <Form.Item {...restField} name={[name, 'name']} label="Attr Name" rules={[{ required: true }]}>
//                                                 <Input placeholder="e.g. Is Spicy" />
//                                             </Form.Item>
//                                         </Col>
//                                         <Col span={8}>
//                                             <Form.Item {...restField} name={[name, 'widgetType']} label="Widget" rules={[{ required: true }]}>
//                                                 <Select>
//                                                     <Select.Option value="switch">Switch (Yes/No)</Select.Option>
//                                                     <Select.Option value="radio">Radio (Selection)</Select.Option>
//                                                 </Select>
//                                             </Form.Item>
//                                         </Col>
//                                         <Col span={8}>
//                                             <Form.Item {...restField} name={[name, 'defaultValue']} label="Default Value" rules={[{ required: true }]}>
//                                                 <Input placeholder="e.g. No" />
//                                             </Form.Item>
//                                         </Col>
//                                     </Row>
//                                     <Form.Item {...restField} name={[name, 'availableOptions']} label="Available Options" rules={[{ required: true }]}>
//                                         <Select mode="tags" placeholder="e.g. Yes, No" />
//                                     </Form.Item>
//                                     <Button type="link" danger onClick={() => remove(name)} icon={<MinusCircleOutlined />}>
//                                         Remove Attribute
//                                     </Button>
//                                     <Divider />
//                                 </div>
//                             ))}
//                             <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
//                                 Add Attribute
//                             </Button>
//                         </>
//                     )}
//                 </Form.List>
//             </Card>
//         </Form>
//     );
// };

// export default CategoryForm;