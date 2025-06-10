import { formatDate } from '@/services/helper';
import { Descriptions, Divider, Drawer, Image, Row, Col, type UploadFile, Upload, Typography } from 'antd';
import type { DescriptionsProps } from 'antd/lib';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface IViewProductProps {
    openViewProduct: boolean;
    setOpenViewProduct: (open: boolean) => void;
    productView: IProductTable | null;
}

const ViewProduct = ({ openViewProduct, setOpenViewProduct, productView }: IViewProductProps) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

    const onClose = () => {
        setOpenViewProduct(false);
    };

    useEffect(() => {
        if (productView) {
            const imgThumbnail: UploadFile = {
                uid: uuidv4(),
                name: productView.thumbnail || '',
                status: 'done',
                url: productView.thumbnail
                    ? `${import.meta.env.VITE_BACKEND_URL}uploads/products/thumbnails/${productView.thumbnail}`
                    : '',
            };
            const imgSlider: UploadFile[] = [];
            if (productView.slider && productView.slider.length > 0) {
                productView.slider.map((item) => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}uploads/products/slider/${item}`,
                    });
                });
            }
            setFileList([imgThumbnail, ...imgSlider]);
        }
    }, [productView]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as File);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const getBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const items: DescriptionsProps['items'] = [
        {
            label: 'Id',
            span: 1,
            children: productView?._id,
        },
        {
            label: 'Tên sản phẩm',
            span: 1,
            children: productView?.name,
        },
        {
            label: 'Mô tả',
            span: 2,
            children: productView?.description,
        },
        {
            label: 'Mô tả ngắn',
            span: 2,
            children: productView?.shortDescription,
        },
        {
            label: 'Danh mục',
            span: 1,
            children: productView?.categoryId?.name || '-',
        },
        {
            label: 'Tags',
            span: 1,
            children: productView?.tags?.join(', ') || '-',
        },
        {
            label: 'Giá',
            span: 1,
            children: productView?.price
                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productView.price)
                : '-',
        },
        {
            label: 'Số lượng',
            span: 1,
            children: productView?.inventory?.total,
        },
        {
            label: 'Ngày tạo',
            span: 1,
            children: formatDate(productView?.createdAt),
        },
        {
            label: 'Ngày cập nhật',
            span: 1,
            children: formatDate(productView?.updatedAt),
        },
    ];

    return (
        <Drawer
            title="Xem chi tiết sản phẩm"
            width={'70vw'}
            onClose={onClose}
            open={openViewProduct}
            styles={{
                body: {
                    paddingBottom: 80,
                },
            }}
        >
            <Descriptions title="Thông tin sản phẩm" bordered column={2} items={items} />
            <Divider orientation="left">Hình ảnh</Divider>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Typography.Text strong>Thumbnail:</Typography.Text>
                    <Upload
                        listType="picture-card"
                        fileList={fileList.slice(0, 1)}
                        onPreview={handlePreview}
                        showUploadList={{ showRemoveIcon: false }}
                    />
                </Col>
                <Col span={12}>
                    <Typography.Text strong>Slider:</Typography.Text>
                    <Upload
                        listType="picture-card"
                        fileList={fileList.slice(1)}
                        onPreview={handlePreview}
                        showUploadList={{ showRemoveIcon: false }}
                    />
                </Col>
            </Row>
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
        </Drawer>
    );
};

export default ViewProduct;
