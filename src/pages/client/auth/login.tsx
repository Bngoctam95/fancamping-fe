import type { FormProps } from 'antd';
import { Button, Card, Checkbox, Col, Form, Input, Row, Typography } from 'antd';
import { useTranslation } from "react-i18next";

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const { Title } = Typography;


const LoginPage = () => {
    const { t } = useTranslation();

    return (
        <Row
            justify="center"
            align="middle"
            style={{
                minHeight: '100vh',
                padding: '20px',
                backgroundColor: '#f0f2f5',
                width: '100%'
            }}
        >
            <Col
                xs={{ span: 24 }}
                sm={{ span: 20 }}
                md={{ span: 16 }}
                lg={{ span: 12 }}
                xl={{ span: 10 }}
                xxl={{ span: 8 }}
                style={{ maxWidth: '500px' }}
            >
                <Card
                    title={<Title level={2} style={{ textAlign: 'center' }}>{t("login.loginText")}</Title>}
                    style={{
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e8e8e8'
                    }}
                >
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}

export default LoginPage;

