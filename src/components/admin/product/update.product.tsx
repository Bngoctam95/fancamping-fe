import { Modal, Form, Input, Row, Col, Divider, Button, InputNumber, Select, Upload, App, Image } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import {
    getEquipmentCategoriesAPI,
    updateProductAPI,
    uploadProductSliderAPI,
    uploadProductThumbnailAPI,
} from 'services/api';
import type { FormProps, GetProp, UploadFile, UploadProps } from 'antd/lib';
import { v4 as uuidv4 } from 'uuid';
import type { UploadChangeParam } from 'antd/lib/upload';

interface IUpdateProductProps {
    openUpdateProduct: boolean;
    setOpenUpdateProduct: (open: boolean) => void;
    productUpdate: IProductTable | null;
    refreshTable: () => void;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type FieldType = {
    _id: string;
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

const UpdateProduct = ({
    openUpdateProduct,
    setOpenUpdateProduct,
    productUpdate,
    refreshTable,
}: IUpdateProductProps) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [loadingThumbnail, setLoadingThumbnail] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

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

    useEffect(() => {
        if (productUpdate) {
            const arrThumbnail = [
                {
                    uid: uuidv4(),
                    name: productUpdate.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}uploads/products/thumbnails/${productUpdate.thumbnail}`,
                },
            ];

            const arrSlider = productUpdate?.slider?.map((item) => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}uploads/products/slider/${item}`,
                };
            });

            form.setFieldsValue({
                _id: productUpdate._id,
                name: productUpdate.name,
                slug: productUpdate.slug,
                description: productUpdate.description,
                shortDescription: productUpdate.shortDescription,
                tags: productUpdate.tags,
                price: productUpdate.price,
                categoryId: productUpdate.categoryId._id,
                inventory: productUpdate.inventory.total,
                thumbnail: arrThumbnail,
                slider: arrSlider,
            });

            setFileListThumbnail(arrThumbnail as any);
            setFileListSlider(arrSlider as any);
        }
    }, [productUpdate]);

    const handleCancel = () => {
        setOpenUpdateProduct(false);
        form.resetFields();
        setFileListThumbnail([]);
        setFileListSlider([]);
    };

    const getBase64 = (file: FileType): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit: FormProps<FieldType>['onFinish'] = async (values) => {
        const { _id, name, slug, description, shortDescription, tags, price, inventory, categoryId } = values;

        // Format inventory data
        const inventoryData = {
            total: Number(inventory),
            available: Number(inventory),
        };

        const thumbnailName = fileListThumbnail?.[0]?.name || '';

        const sliderNames = fileListSlider?.map((item: any) => item.name) || [];

        setLoadingSubmit(true);

        const res = await updateProductAPI(
            _id,
            name,
            slug,
            shortDescription,
            description,
            categoryId,
            tags,
            price,
            inventoryData,
            thumbnailName,
            sliderNames
        );

        if (res?.data) {
            //success
            form.resetFields();
            setOpenUpdateProduct(false);
            message.success('Updated Product Successfully!');
            refreshTable();
        } else {
            //error
            message.error(res.message);
        }
        setLoadingSubmit(false);
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const handleUploadFileThumbnail = async (options: any) => {
        const { file, onSuccess, onError } = options;
        const res = await uploadProductThumbnailAPI(file);
        if (res?.data) {
            const uploadFile: UploadFile = {
                uid: file.uid,
                name: res.data,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}uploads/products/thumbnails/${res.data}`,
            };
            setFileListThumbnail([{ ...uploadFile }]);
            if (onSuccess) onSuccess('ok');
        } else {
            if (onError) onError(new Error(res.message || 'Upload failed'));
            message.error(res.message || 'Upload failed');
        }
    };

    const beforeUploadThumbnail = (file: FileType) => {
        const isValidFormat = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
        if (!isValidFormat) {
            message.error('You can only upload JPG/PNG/WebP file!');
            return Upload.LIST_IGNORE;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must smaller than 5MB!');
            return Upload.LIST_IGNORE;
        }
        return isValidFormat && isLt5M;
    };

    const handleChangeThumbnail = (info: UploadChangeParam) => {
        setLoadingThumbnail(true);
        console.log('info.file.status', info.file.status);
        if (info.file.status === 'done') {
            setLoadingThumbnail(false);
            return;
        }
        if (info.file.status === 'error') {
            setLoadingThumbnail(false);
            return;
        }

        if (info.file.status === 'removed') {
            setLoadingThumbnail(false);
            return;
        }
    };

    const handlePreviewThumbnail = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleRemoveThumbnail = () => {
        setFileListThumbnail([]);
    };

    const handleUploadFileSlider = async (options: any) => {
        const { file, onSuccess, onError } = options;
        const res = await uploadProductSliderAPI([file]);
        if (res?.data) {
            const uploadFile: UploadFile = {
                uid: file.uid,
                name: res.data[0],
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}uploads/products/slider/${res.data[0]}`,
            };
            setFileListSlider((prevState) => [...prevState, { ...uploadFile }]);
            if (onSuccess) onSuccess('ok');
        } else {
            if (onError) onError(new Error(res.message || 'Upload failed'));
            message.error(res.message || 'Upload failed');
        }
    };

    const beforeUploadSlider = (file: FileType) => {
        const isValidFormat = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
        if (!isValidFormat) {
            message.error('You can only upload JPG/PNG/WebP file!');
            return Upload.LIST_IGNORE;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must smaller than 5MB!');
            return Upload.LIST_IGNORE;
        }
        return isValidFormat && isLt5M;
    };

    const handleChangeSlider = (info: any) => {
        setLoadingSlider(true);

        if (info.file.status === 'done') {
            setLoadingSlider(false);
            return;
        }
        if (info.file.status === 'error') {
            setLoadingSlider(false);
            return;
        }

        if (info.file.status === 'removed') {
            setLoadingSlider(false);
            return;
        }
    };

    const handlePreviewSlider = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleRemoveSlider = (file: UploadFile) => {
        setFileListSlider(fileListSlider.filter((f) => f.uid !== file.uid));
    };

    return (
        <Modal
            title="Cập nhật sản phẩm"
            open={openUpdateProduct}
            onCancel={handleCancel}
            footer={null}
            destroyOnHidden
            width={'50vw'}
        >
            <Divider></Divider>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Row gutter={[16, 16]}>
                    <Form.Item labelCol={{ span: 24 }} label="_id" name="_id" hidden>
                        <Input />
                    </Form.Item>
                    <Col span={12}>
                        {/* Name */}
                        <Form.Item
                            label="Tên sản phẩm"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                        >
                            <Input id="modal_name" />
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
                                    {loadingThumbnail ? (
                                        <>
                                            <LoadingOutlined />
                                            <div style={{ marginTop: 8 }}>Uploading...</div>
                                        </>
                                    ) : (
                                        <>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </>
                                    )}
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
                                    {loadingSlider ? (
                                        <>
                                            <LoadingOutlined />
                                            <div style={{ marginTop: 8 }}>Uploading...</div>
                                        </>
                                    ) : (
                                        <>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </>
                                    )}
                                </div>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loadingSubmit}>
                        Cập nhật sản phẩm
                    </Button>
                </Form.Item>
            </Form>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </Modal>
    );
};

export default UpdateProduct;
