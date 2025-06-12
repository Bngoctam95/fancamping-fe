import { createEquipmentCategoryAPI } from "services/api";
import { App, Button, Divider, Form, Input, Modal } from "antd";
import type { FormProps } from "antd/lib";
import { useState } from "react";

interface ICreateCategoryProps {
    openCreateCategory: boolean;
    setOpenCreateCategory: (open: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    name: string;
    slug: string;
    description: string;
};

const CreateCategory = ({ openCreateCategory, setOpenCreateCategory, refreshTable }: ICreateCategoryProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();

    const handleCancel = () => {
        setOpenCreateCategory(false);
    }

    const handleSubmit: FormProps<FieldType>['onFinish'] = async (values) => {
        const { name, slug, description } = values;
        setLoading(true);
        const res = await createEquipmentCategoryAPI(name, slug, description);
        if (res?.data) {
            //success
            form.resetFields();
            setOpenCreateCategory(false);
            message.success('Tạo danh mục thành công');
            refreshTable();
        } else {
            //error
            message.error(res.message);
        }
        setLoading(false);
    };

    const generateSlug = (text: string): string => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[đĐ]/g, 'd')           // Replace Vietnamese 'd'
            .replace(/[^a-z0-9\s-]/g, '')    // Remove special characters
            .replace(/\s+/g, '-')            // Replace spaces with -
            .replace(/-+/g, '-')             // Replace multiple - with single -
            .trim();                         // Trim - from start and end of text
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = generateSlug(name);
        form.setFieldValue('slug', slug);
    };

    return (
        <Modal
            title='Tạo mới danh mục'
            footer={null}
            open={openCreateCategory}
            onCancel={handleCancel}
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
                    label="Tên danh mục"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
                >
                    <Input id="modal_name" onChange={handleNameChange} />
                </Form.Item>

                {/* Email */}
                <Form.Item
                    label="Slug"
                    name="slug"
                    rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
                >
                    <Input autoComplete='slug' id="modal_slug" />
                </Form.Item>

                {/* Password */}
                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                >
                    <Input.TextArea autoComplete='description' id="modal_description" />
                </Form.Item>


                {/* Avatar Upload */}
                {/*
                    <Form.Item
                        label="Hình ảnh"
                        name="image"
                        rules={[{ required: true, message: 'Vui lòng nhập hình ảnh' }]}
                    >
                        <Upload
                            beforeUpload={() => false}
                            accept="image/*"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Tải lên</Button>
                        </Upload>
                    </Form.Item>
                */}

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Tạo danh mục
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreateCategory;