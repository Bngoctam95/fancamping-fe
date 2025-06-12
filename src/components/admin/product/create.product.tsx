import { PlusOutlined } from '@ant-design/icons';
import {
    App,
    Button,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Upload,
    type FormProps,
    type UploadFile,
} from 'antd';
import type { GetProp, UploadProps } from 'antd/lib';
import { useEffect, useState } from 'react';
import {
    createProductAPI,
    getEquipmentCategoriesAPI,
    uploadProductSliderAPI,
    uploadProductThumbnailAPI,
} from 'services/api';

interface ICreateProductProps {
    openCreateProduct: boolean;
    setOpenCreateProduct: (open: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    categoryId: string;
    tags: string[];
    price: number;
    inventory: number;
    thumbnail: UploadFile;
    slider: UploadFile[];
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const CreateProduct = ({ openCreateProduct, setOpenCreateProduct, refreshTable }: ICreateProductProps) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getEquipmentCategoriesAPI();
            if (res?.data) {
                const categories = res.data as unknown as IEquipmentCategory[];
                const formattedOptions = categories.map((category) => ({
                    value: category._id,
                    label: category.name,
                }));
                setOptions(formattedOptions);
            } else {
                message.error(res?.message || 'Lỗi khi tải danh mục');
            }
        };

        fetchCategories();
    }, []);

    const handleCancel = () => {
        setOpenCreateProduct(false);
        form.resetFields();
        setFileListThumbnail([]);
        setFileListSlider([]);
    };

    const handleSubmit: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoading(true);
        const { name, slug, shortDescription, description, categoryId, tags, price, inventory } = values;

        // Format inventory data
        const inventoryData = {
            total: Number(inventory),
            available: Number(inventory),
        };

        // Get the uploaded thumbnail URL
        let thumbnailUrl = '';
        if (fileListThumbnail.length > 0 && fileListThumbnail[0].response) {
            console.log('Thumbnail file:', fileListThumbnail[0]);
            thumbnailUrl = fileListThumbnail[0].response;
        }

        // Get the uploaded slider URLs
        const sliderUrls = fileListSlider.filter((file) => file.response).map((file) => file.response);

        // Log the final data being sent
        console.log('Data being sent:', {
            name,
            slug,
            shortDescription,
            description,
            categoryId,
            tags,
            price,
            inventory: inventoryData,
            thumbnail: thumbnailUrl,
            slider: sliderUrls,
        });

        // Create the product
        const res = await createProductAPI(
            name,
            slug,
            shortDescription,
            description,
            categoryId,
            tags,
            price,
            inventoryData,
            thumbnailUrl,
            sliderUrls
        );

        if (res?.data) {
            message.success('Tạo sản phẩm thành công');
            handleCancel();
            refreshTable();
        } else {
            message.error(res?.message || 'Có lỗi xảy ra');
        }

        setLoading(false);
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const beforeUploadThumbnail = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must smaller than 5MB!');
        }
        return isJpgOrPng && isLt5M;
    };

    const beforeUploadSlider = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must smaller than 5MB!');
        }
        return isJpgOrPng && isLt5M;
    };

    const handleUploadFileThumbnail = async (options: any) => {
        const { file, onSuccess, onError } = options;
        try {
            const res = await uploadProductThumbnailAPI(file);
            console.log('Upload thumbnail response:', res);
            if (res.data) {
                console.log('Thumbnail path:', res.data);
                onSuccess(res.data);
            } else {
                onError('Upload failed');
            }
        } catch (error: any) {
            console.error('Upload thumbnail error:', error);
            onError(error?.response?.data?.message || 'Upload failed');
        }
    };

    const handleChangeThumbnail = (info: any) => {
        setFileListThumbnail(info.fileList);
    };

    const handlePreviewThumbnail = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = URL.createObjectURL(file.originFileObj as Blob);
        }
    };

    const handleRemoveThumbnail = () => {
        setFileListThumbnail([]);
        return true;
    };

    const handleUploadFileSlider = async (options: any) => {
        const { file, onSuccess, onError } = options;
        try {
            const res = await uploadProductSliderAPI([file]);
            console.log('Upload slider response:', res);
            if (res.data && res.data.length > 0) {
                const sliderPath = res.data[0];
                console.log('Slider path:', sliderPath);
                onSuccess(sliderPath);
            } else {
                onError('Upload failed');
            }
        } catch (error: any) {
            console.error('Upload slider error:', error);
            onError(error?.response?.data?.message || 'Upload failed');
        }
    };

    const handleChangeSlider = (info: any) => {
        setFileListSlider(info.fileList);
    };

    const handlePreviewSlider = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = URL.createObjectURL(file.originFileObj as Blob);
        }
    };

    const handleRemoveSlider = (file: UploadFile) => {
        const newFileList = fileListSlider.filter((item) => item.uid !== file.uid);
        setFileListSlider(newFileList);
        return true;
    };

    const generateSlug = (text: string): string => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[đĐ]/g, 'd') // Replace Vietnamese 'd'
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/-+/g, '-') // Replace multiple - with single -
            .trim(); // Trim - from start and end of text
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = generateSlug(name);
        form.setFieldValue('slug', slug);
    };

    return (
        <Modal
            title="Tạo mới sản phẩm"
            open={openCreateProduct}
            onCancel={handleCancel}
            footer={null}
            destroyOnHidden
            width={'50vw'}
        >
            <Divider></Divider>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        {/* Name */}
                        <Form.Item
                            label="Tên sản phẩm"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                        >
                            <Input id="modal_name" onChange={handleNameChange} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        {/* Slug */}
                        <Form.Item label="Slug" name="slug" rules={[{ required: true, message: 'Vui lòng nhập slug' }]}>
                            <Input id="modal_slug" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        {/* Description */}
                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Nhập mô tả" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        {/* Short Description */}
                        <Form.Item
                            label="Mô tả ngắn"
                            name="shortDescription"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả ngắn' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Nhập mô tả ngắn" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        {/* Category */}
                        <Form.Item
                            label="Danh mục"
                            name="categoryId"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                        >
                            <Select options={options} placeholder="Chọn danh mục" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        {/* Tags */}
                        <Form.Item label="Tags" name="tags" rules={[{ required: true, message: 'Vui lòng nhập tags' }]}>
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                placeholder="Nhập tags"
                                tokenSeparators={[',']}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        {/* Price */}
                        <Form.Item label="Giá" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                addonBefore="VND"
                                placeholder="Nhập giá"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                parser={(value) => value!.replace(/\./g, '')}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        {/* inventory */}
                        <Form.Item
                            label="Số lượng"
                            name="inventory"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số lượng" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        {/* Thumbnail */}
                        <Form.Item
                            label="Thumbnail"
                            name="thumbnail"
                            rules={[{ required: true, message: 'Please upload thumbnail' }]}
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                maxCount={1}
                                multiple={false}
                                customRequest={(options) => handleUploadFileThumbnail(options)}
                                beforeUpload={beforeUploadThumbnail}
                                onChange={(info) => {
                                    handleChangeThumbnail(info);
                                }}
                                onPreview={handlePreviewThumbnail}
                                onRemove={handleRemoveThumbnail}
                                fileList={fileListThumbnail}
                            >
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        {/* Slider */}
                        <Form.Item
                            label="Slider"
                            name="slider"
                            rules={[{ required: true, message: 'Please upload slider' }]}
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                multiple={true}
                                customRequest={(options) => handleUploadFileSlider(options)}
                                beforeUpload={beforeUploadSlider}
                                onChange={(info) => {
                                    handleChangeSlider(info);
                                }}
                                onPreview={handlePreviewSlider}
                                onRemove={(file) => handleRemoveSlider(file)}
                                fileList={fileListSlider}
                            >
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Tạo sản phẩm
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateProduct;
