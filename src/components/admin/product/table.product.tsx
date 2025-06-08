import { getProductsAPI } from "services/api";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import CreateProduct from "components/admin/product/create.product";

const TableProduct = () => {
    const actionRef = useRef<ActionType>();
    const [openCreateProduct, setOpenCreateProduct] = useState(false);

    const [meta, setMeta] = useState({
        page: 1,
        limit: 5,
        totalPages: 0,
        total: 0
    });

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const handleCreateProduct = () => {
        setOpenCreateProduct(true);
    }

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
            render(dom, entity, index, action, schema) {
                return (
                    <a>{entity._id}</a>
                )
            },
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Danh mục',
            dataIndex: ['categoryId', 'name'],
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            hideInSearch: true,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            hideInSearch: true,
            valueType: 'money',
            fieldProps: {
                prefix: 'VND'
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            hideInSearch: true,
            valueType: 'date',
            sorter: (a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateA - dateB;
            }
        },
        {
            title: 'Hành động',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: 'pointer', marginRight: 30 }}
                            title='Sửa sản phẩm'
                        />

                        <Popconfirm
                            title="Xóa sản phẩm"
                            description="Bạn có chắc chắn muốn xóa sản phẩm này không?"
                            okText="Xóa"
                            cancelText="Hủy"
                            placement='leftTop'
                        >
                            <DeleteTwoTone
                                twoToneColor="#ff4d4f"
                                style={{ cursor: 'pointer' }}
                                title='Xóa sản phẩm'
                            />
                        </Popconfirm>
                    </>
                )
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

                    let query = "";

                    if (params) {
                        query += `page=${params.current}&limit=${params.pageSize}`
                        if (params.name) {
                            query += `&name=${params.name}`
                        }
                        if (params.categoryId) {
                            query += `&categoryId=${params.categoryId}`
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
                        setMeta(meta);
                    }

                    return {
                        data: res.data?.items,
                        page: 1,
                        success: true,
                        total: res.data?.total
                    }

                }}
                rowKey="_id"
                pagination={{
                    pageSize: 5,
                    current: 1,
                    total: 0,
                    showSizeChanger: true,
                    pageSizeOptions: [5, 10, 20],
                    showTotal(total, range) {
                        return (
                            <div>{range[0]}-{range[1]} trên {total} mục</div>
                        )
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
                    </Button>
                ]}
            />
            <CreateProduct
                openCreateProduct={openCreateProduct}
                setOpenCreateProduct={setOpenCreateProduct}
                refreshTable={refreshTable}
            />
        </>
    );
}

export default TableProduct;