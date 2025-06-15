import { deleteEquipmentCategoryAPI, getEquipmentCategoriesAPI } from 'services/api';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { App, Button, Popconfirm, Table } from 'antd';
import type { TableProps } from 'antd';
import { useEffect, useState } from 'react';
import CreateCategory from 'components/admin/category/equipment/create.category';
import { formatDate } from 'services/helper';
import UpdateCategory from 'components/admin/category/equipment/update.category';

const EquipmentCategory = () => {
    const { message, notification } = App.useApp();
    const [data, setData] = useState<IEquipmentCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [openCreateCategory, setOpenCreateCategory] = useState<boolean>(false);
    const [openUpdateCategory, setOpenUpdateCategory] = useState<boolean>(false);
    const [categoryUpdate, setCategoryUpdate] = useState<IEquipmentCategory | null>(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [isDeleteCategory, setIsDeleteCategory] = useState(false);

    const handleAdd = () => {
        setOpenCreateCategory(true);
    }

    const handleDeleteCategory = async (id: string) => {
        setIsDeleteCategory(true);
        const res = await deleteEquipmentCategoryAPI(id);
        if (res?.data) {
            message.success('Xóa danh mục thành công!');
            refreshData();
        } else {
            notification.error({
                message: 'Lỗi xảy ra',
                description: res.message
            })
        }
        setIsDeleteCategory(false);
    }

    const handleUpdateCategory = (category: IEquipmentCategory) => {
        setOpenUpdateCategory(true);
        setCategoryUpdate(category);
    }

    const columns: TableProps<IEquipmentCategory>['columns'] = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            render: (_, __, index) => {
                return (pagination.current - 1) * pagination.pageSize + index + 1;
            },
        },
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => formatDate(date),
            defaultSortOrder: 'descend',
            sorter: (a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateA - dateB;
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <>
                    <EditTwoTone
                        twoToneColor="#f57800"
                        style={{ cursor: 'pointer', marginRight: 30 }}
                        title='Sửa danh mục'
                        onClick={() => handleUpdateCategory(record)}
                    />

                    <Popconfirm
                        title="Xóa danh mục"
                        description="Bạn có chắc chắn muốn xóa danh mục này không?"
                        okText="Xóa"
                        cancelText="Hủy"
                        placement='leftTop'
                        onConfirm={() => handleDeleteCategory(record._id)}
                        okButtonProps={{ loading: isDeleteCategory }}
                    >
                        <DeleteTwoTone
                            twoToneColor="#ff4d4f"
                            style={{ cursor: 'pointer' }}
                            title='Xóa danh mục'
                        />
                    </Popconfirm>
                </>
            ),
        },
    ];

    const refreshData = async () => {
        try {
            setLoading(true);
            const response = await getEquipmentCategoriesAPI();
            if (response && Array.isArray(response.data)) {
                setData(response.data);
            }
        } catch (error) {
            console.error('Error fetching equipment categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <div>
            <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
                Thêm danh mục
            </Button>
            <Table<IEquipmentCategory>
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="_id"
                pagination={{
                    ...pagination,
                    pageSizeOptions: ['10', '20'],
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} mục`,
                    onChange: (current, pageSize) => {
                        setPagination({ current, pageSize });
                    }
                }}
            />
            <CreateCategory
                openCreateCategory={openCreateCategory}
                setOpenCreateCategory={setOpenCreateCategory}
                refreshTable={refreshData}
            />
            <UpdateCategory
                openUpdateCategory={openUpdateCategory}
                setOpenUpdateCategory={setOpenUpdateCategory}
                categoryUpdate={categoryUpdate}
                refreshTable={refreshData}
            />
        </div>
    );
}

export default EquipmentCategory;