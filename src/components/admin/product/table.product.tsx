import { deleteProductAPI, getProductsAPI, getEquipmentCategoriesAPI } from 'services/api';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState, useEffect } from 'react';
import CreateProduct from 'components/admin/product/create.product';
import ViewProduct from 'components/admin/product/view.product';
import UpdateProduct from 'components/admin/product/update.product';

const TableProduct = () => {
    const actionRef = useRef<ActionType>();
    const { message, notification } = App.useApp();
    const [openCreateProduct, setOpenCreateProduct] = useState(false);
    const [openViewProduct, setOpenViewProduct] = useState(false);
    const [openUpdateProduct, setOpenUpdateProduct] = useState(false);
    const [productView, setProductView] = useState<IProductTable | null>(null);
    const [productUpdate, setProductUpdate] = useState<IProductTable | null>(null);
    const [categories, setCategories] = useState<{ [key: string]: string }>({});

    const [meta, setMeta] = useState({
        page: 1,
        limit: 10,
        totalPages: 0,
        total: 0,
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getEquipmentCategoriesAPI();
            if (res?.data) {
                const categoryMap = (res.data as unknown as IEquipmentCategory[]).reduce((acc, category) => {
                    acc[category._id] = category.name;
                    return acc;
                }, {} as { [key: string]: string });
                setCategories(categoryMap);
            }
        };
        fetchCategories();
    }, []);

    const refreshTable = () => {
        actionRef.current?.reload();
    };

    const handleCreateProduct = () => {
        setOpenCreateProduct(true);
    };

    const handleDeleteProduct = async (_id: string) => {
        const res = await deleteProductAPI(_id);
        if (res?.data) {
            message.success('Xóa sản phẩm thành công!');
            refreshTable();
        } else {
            notification.error({
                message: 'Lỗi xảy ra',
                description: res.message,
            });
        }
    };

    const handleViewProduct = (product: IProductTable) => {
        setOpenViewProduct(true);
        setProductView(product);
    };

    const handleUpdateProduct = (product: IProductTable) => {
        setOpenUpdateProduct(true);
        setProductUpdate(product);
    };

    const columns: ProColumns<IProductTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
            render: (_, __, index) => {
                return (meta.page - 1) * meta.limit + index + 1;
            },
        },
        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render(_, entity) {
                return (
                    <a
                        onClick={() => {
                            handleViewProduct(entity);
                        }}
                    >
                        {entity._id}
                    </a>
                );
            },
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Danh mục',
            dataIndex: ['categoryId', '_id'],
            hideInSearch: true,
            filters: true,
            onFilter: true,
            ellipsis: true,
            valueType: 'select',
            valueEnum: categories,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            hideInSearch: true,
            ellipsis: true,
            width: 400,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            hideInSearch: true,
            width: 150,
            render: (price) => {
                return new Intl.NumberFormat('vi-VN').format(Number(price) || 0) + ' đ';
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            hideInSearch: true,
            width: 150,
            valueType: 'date',
            sorter: (a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateA - dateB;
            },
        },
        {
            title: 'Hành động',
            hideInSearch: true,
            width: 150,
            render(_, entity) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: 'pointer', marginRight: 30 }}
                            title="Sửa sản phẩm"
                            onClick={() => {
                                handleUpdateProduct(entity);
                            }}
                        />

                        <Popconfirm
                            title="Xóa sản phẩm"
                            description="Bạn có chắc chắn muốn xóa sản phẩm này không?"
                            okText="Xóa"
                            cancelText="Hủy"
                            placement="leftTop"
                            onConfirm={() => {
                                handleDeleteProduct(entity._id);
                            }}
                        >
                            <DeleteTwoTone twoToneColor="#ff4d4f" style={{ cursor: 'pointer' }} title="Xóa sản phẩm" />
                        </Popconfirm>
                    </>
                );
            },
        },
    ];

    return (
        <>
            <ProTable<IProductTable>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                search={{
                    labelWidth: 100,
                    defaultCollapsed: false,
                    span: {
                        xs: 24,
                        sm: 24,
                        md: 12,
                        lg: 12,
                        xl: 8,
                        xxl: 6,
                    },
                }}
                request={async (params, sort, filter) => {
                    console.log(sort, filter, params);

                    let query = '';

                    if (params) {
                        query += `page=${params.current}&limit=${params.pageSize}`;
                        if (params.name) {
                            query += `&name=${params.name}`;
                        }
                        if (params.categoryId) {
                            query += `&categoryId=${params.categoryId}`;
                        }
                    }

                    if (sort && Object.keys(sort).length > 0) {
                        const sortKey = Object.keys(sort)[0];
                        const sortValue = sort[sortKey] === 'ascend' ? '' : '-';
                        query += `&sort=${sortValue}${sortKey}`;
                    } else {
                        //default sort
                        query += `&sort=-createdAt`;
                    }
                    const res = await getProductsAPI(query);

                    if (res.data) {
                        const { page, limit, totalPages, total } = res.data;
                        const meta = { page, limit, totalPages, total };
                        console.log('meta', meta);
                        setMeta(meta);
                    }

                    return {
                        data: res.data?.items,
                        page: 1,
                        success: true,
                        total: res.data?.total,
                    };
                }}
                rowKey="_id"
                pagination={{
                    pageSize: meta.limit,
                    current: meta.page,
                    total: meta.total,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20],
                    showTotal(total, range) {
                        return (
                            <div>
                                {range[0]}-{range[1]} trên {total} mục
                            </div>
                        );
                    },
                }}
                headerTitle="Bảng sản phẩm"
                toolBarRender={() => [
                    <Button
                        key="add-new-button"
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => {
                            handleCreateProduct();
                        }}
                    >
                        Thêm mới
                    </Button>,
                ]}
            />
            <CreateProduct
                openCreateProduct={openCreateProduct}
                setOpenCreateProduct={setOpenCreateProduct}
                refreshTable={refreshTable}
            />
            <ViewProduct
                openViewProduct={openViewProduct}
                setOpenViewProduct={setOpenViewProduct}
                productView={productView}
            />
            <UpdateProduct
                openUpdateProduct={openUpdateProduct}
                setOpenUpdateProduct={setOpenUpdateProduct}
                productUpdate={productUpdate}
                refreshTable={refreshTable}
            />
        </>
    );
};

export default TableProduct;
