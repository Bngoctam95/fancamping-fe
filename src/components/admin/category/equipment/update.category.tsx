import { updateEquipmentCategoryAPI } from "services/api";
import { App, Button, Divider, Form, Input, Modal } from "antd";
import type { FormProps } from "antd/lib";
import { useEffect, useState } from "react";

interface IUpdateCategoryProps {
    openUpdateCategory: boolean;
    setOpenUpdateCategory: (open: boolean) => void;
    categoryUpdate: IEquipmentCategory | null;
    refreshTable: () => void;
}

type FieldType = {
    _id: string;
    name: string;
    slug: string;
    description: string;
}

const UpdateCategory = ({ openUpdateCategory, setOpenUpdateCategory, categoryUpdate, refreshTable }: IUpdateCategoryProps) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        setOpenUpdateCategory(false);
    }

    const handleSubmit: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoading(true);
        const res = await updateEquipmentCategoryAPI(values._id, values.name, values.slug, values.description);
        if (res?.data) {
            setOpenUpdateCategory(false);
            message.success('Cập nhật danh mục thành công');
            refreshTable();
        } else {
            message.error(res.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (categoryUpdate) {
            form.setFieldsValue({
                _id: categoryUpdate._id,
                name: categoryUpdate.name,
                slug: categoryUpdate.slug,
                description: categoryUpdate.description,
            });
        }
    }, [categoryUpdate, form]);
    return (
        <Modal
            title='Cập nhật danh mục'
            open={openUpdateCategory}
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
                    label="Tên danh mục"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
                >
                    <Input id="modal_name" />
                </Form.Item>

                {/* Email */}
                <Form.Item
                    label="Slug"
                    name="slug"
                    rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
                >
                    <Input id="modal_slug" />
                </Form.Item>

                {/* Phone */}
                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                >
                    <Input.TextArea id="modal_description" />
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

export default UpdateCategory;