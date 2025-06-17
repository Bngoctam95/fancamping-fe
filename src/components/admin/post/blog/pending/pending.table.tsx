import { getAllPostsAPI, updatePostStatusAPI } from "@/services/api";
import { App, Button, Table } from "antd";
import type { TableProps } from "antd/lib";
import { useEffect, useState } from "react";
import { formatDate } from 'services/helper';

const PendingTable = () => {
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [data, setData] = useState<IPostTable[]>([]);
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();

    const columns: TableProps<IPostTable>['columns'] = [
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
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Tác giả',
            dataIndex: 'authorId',
            key: 'authorId',
            render: (authorId) => authorId?.name,
        },
        {
            title: 'Danh mục',
            dataIndex: 'categoryId',
            key: 'categoryId',
            render: (categoryId) => categoryId?.name,
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
                    <Button
                        color="primary"
                        variant="solid"
                        style={{ cursor: 'pointer', marginRight: 10 }}
                        onClick={() => handleApprove(record._id)}
                        loading={loading}
                    >
                        Duyệt
                    </Button>
                    <Button
                        color="danger"
                        variant="solid"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleReject(record._id)}
                        loading={loading}
                    >
                        Từ chối
                    </Button>

                </>
            ),
        },
    ];

    const handleApprove = async (id: string) => {
        setLoading(true);
        const res = await updatePostStatusAPI(id, 'published');
        if (res?.data) {
            message.success('Duyệt bài viết thành công');
            refreshData();
        } else {
            message.error('Duyệt bài viết thất bại');
        }
        setLoading(false);
    }

    const handleReject = async (id: string) => {
        setLoading(true);
        const res = await updatePostStatusAPI(id, 'rejected');
        if (res?.data) {
            message.success('Từ chối bài viết thành công');
            refreshData();
        } else {
            message.error('Từ chối bài viết thất bại');
        }
        setLoading(false);
    }

    const refreshData = async () => {
        try {
            setLoading(true);
            const res = await getAllPostsAPI(`type=blog&status=pending`);
            if (res?.data) {
                setData(res.data);
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
            <Table<IPostTable>
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
        </div>
    )
}

export default PendingTable;