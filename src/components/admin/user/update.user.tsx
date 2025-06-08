import { updateUserAPI } from "services/api";
import { App, Button, Divider, Form, Input, Modal } from "antd";
import type { FormProps } from "antd/lib";
import { useEffect, useState } from "react";

interface IUpdateUserProps {
    openUpdateUser: boolean;
    setOpenUpdateUser: (open: boolean) => void;
    userUpdate: IUserTable | null;
    refreshTable: () => void;
}

type FieldType = {
    _id: string;
    name: string;
    email: string;
    phone: string;
};

const UpdateUser = ({ openUpdateUser, setOpenUpdateUser, userUpdate, refreshTable }: IUpdateUserProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();

    const handleSubmit: FormProps<FieldType>['onFinish'] = async (values) => {
        const { _id, name, phone } = values;
        setLoading(true);
        const res = await updateUserAPI(_id, name, phone);
        if (res?.data) {
            //success
            setOpenUpdateUser(false);
            message.success('Cập nhật user thành công');
            refreshTable();
        } else {
            //error
            message.error(res.message);
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setOpenUpdateUser(false);
    }

    useEffect(() => {
        if (userUpdate) {
            form.setFieldsValue({
                _id: userUpdate._id,
                email: userUpdate.email,
                phone: userUpdate.phone,
                name: userUpdate.name
            });
        }
    }, [userUpdate, form]);

    return (
        <Modal
            title='Cập nhật người dùng'
            open={openUpdateUser}
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
                {/* Id */}
                <Form.Item
                    label="Id"
                    name="_id"
                    rules={[{ required: true, message: 'Vui lòng nhập Id' }]}
                    hidden
                >
                    <Input id="modal_Id" disabled />
                </Form.Item>

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
                    <Input autoComplete='email' id="modal_email" disabled />
                </Form.Item>

                {/* Phone */}
                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, pattern: /^[0-9]+$/, message: 'Số điện thoại không hợp lệ' }]}
                >
                    <Input id="modal_phone" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default UpdateUser;