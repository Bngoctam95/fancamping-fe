import { createUserAPI } from "services/api";
import { App, Button, Divider, Form, Input, Modal } from "antd";
import type { FormProps } from "antd/lib";
import { useState } from "react";

interface ICreateUserProps {
    openCreateUser: boolean;
    setOpenCreateUser: (open: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    name: string;
    email: string;
    phone: string;
    password: string;
};

const CreateUser = ({ openCreateUser, setOpenCreateUser, refreshTable }: ICreateUserProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();

    const handleSubmit: FormProps<FieldType>['onFinish'] = async (values) => {
        const { name, email, password, phone } = values;
        setLoading(true);
        const res = await createUserAPI(name, email, password, phone);
        if (res?.data) {
            //success
            form.resetFields();
            setOpenCreateUser(false);
            message.success('Tạo tài khoản thành công');
            refreshTable();
        } else {
            //error
            message.error(res.message);
        }
        setLoading(false);
    };


    const handleCancel = () => {
        setOpenCreateUser(false);
    }

    return (
        <Modal
            title='Tạo mới người dùng'
            open={openCreateUser}
            onCancel={handleCancel}
            footer={null}
            destroyOnHidden
        >
            <Divider></Divider>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                {/* Full Name */}
                <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                >
                    <Input id="modal_name" />
                </Form.Item>

                {/* Email */}
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ type: 'email', message: 'Email không hợp lệ' }, { required: true }]}
                >
                    <Input autoComplete='email' id="modal_email" />
                </Form.Item>

                {/* Password */}
                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                >
                    <Input.Password autoComplete='current-password' id="modal_password" />
                </Form.Item>

                {/* Phone */}
                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, pattern: /^[0-9]+$/, message: 'Số điện thoại không hợp lệ' }]}
                >
                    <Input id="modal_phone" />
                </Form.Item>

                {/* Avatar Upload */}
                {/* <Form.Item label="Avatar">
                    <Upload
                        fileList={fileList}
                        onChange={({ fileList }) => setFileList(fileList)}
                        beforeUpload={() => false}
                        accept="image/*"
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Form.Item> */}

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Tạo tài khoản
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreateUser;