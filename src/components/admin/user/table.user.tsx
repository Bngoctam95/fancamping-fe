import { deleteUserAPI, getUsersAPI } from 'services/api';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import ViewUser from 'components/admin/user/view.user';
import UpdateUser from 'components/admin/user/update.user';
import CreateUser from 'components/admin/user/create.user';

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
    const [openViewUser, setOpenViewUser] = useState<boolean>(false);
    const [openUpdateUser, setOpenUpdateUser] = useState<boolean>(false);
    const [openCreateUser, setOpenCreateUser] = useState<boolean>(false);
    const [userView, setUserView] = useState<IUserTable | null>(null);
    const [userUpdate, setUserUpdate] = useState<IUserTable | null>(null);
    const { message, notification } = App.useApp();

    const [meta, setMeta] = useState({
        page: 1,
        limit: 5,
        totalPages: 0,
        total: 0,
    });

    const refreshTable = () => {
        actionRef.current?.reload();
    };

    const handleDeleteUser = async (_id: string) => {
        setIsDeleteUser(true);
        const res = await deleteUserAPI(_id);
        if (res?.data) {
            message.success('Xóa người dùng thành công!');
            refreshTable();
        } else {
            notification.error({
                message: 'Lỗi xảy ra',
                description: res.message,
            });
        }
        setIsDeleteUser(false);
    };

    const handleViewUser = (user: IUserTable) => {
        setOpenViewUser(true);
        setUserView(user);
    };

    const handleUpdateUser = (user: IUserTable) => {
        setOpenUpdateUser(true);
        setUserUpdate(user);
    };

    const handleCreateUser = () => {
        setOpenCreateUser(true);
    };

    const columns: ProColumns<IUserTable>[] = [
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
                        href="#"
                        onClick={() => {
                            handleViewUser(entity);
                        }}
                    >
                        {entity._id}
                    </a>
                );
            },
        },
        {
            title: 'Họ và tên',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            render(_, entity) {
                return entity.role === 'user'
                    ? 'User'
                    : entity.role === 'admin'
                      ? 'Admin'
                      : entity.role === 'super_admin'
                        ? 'Super Admin'
                        : 'Moderator';
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            hideInSearch: true,
            valueType: 'date',
            sorter: true,
        },
        {
            title: 'Hành động',
            hideInSearch: true,
            render(_, entity) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: 'pointer', marginRight: 30 }}
                            title="Sửa người dùng"
                            onClick={() => {
                                handleUpdateUser(entity);
                            }}
                        />

                        <Popconfirm
                            title="Xóa người dùng"
                            description="Bạn có chắc chắn muốn xóa người dùng này không?"
                            onConfirm={() => {
                                handleDeleteUser(entity._id);
                            }}
                            okText="Xóa"
                            cancelText="Hủy"
                            placement="leftTop"
                            okButtonProps={{ loading: isDeleteUser }}
                        >
                            <DeleteTwoTone
                                twoToneColor="#ff4d4f"
                                style={{ cursor: 'pointer' }}
                                title="Xóa người dùng"
                            />
                        </Popconfirm>
                    </>
                );
            },
        },
    ];

    return (
        <>
            <ProTable<IUserTable>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(sort, filter, params);

                    let query = '';

                    if (params) {
                        query += `page=${params.current}&limit=${params.pageSize}`;
                        if (params.email) {
                            query += `&email=${params.email}`;
                        }
                        if (params.name) {
                            query += `&name=${params.name}`;
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

                    const res = await getUsersAPI(query);

                    if (res.data) {
                        const { page, limit, totalPages, total } = res.data;
                        const meta = { page, limit, totalPages, total };
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
                    pageSizeOptions: [5, 10, 20],
                    showTotal(total, range) {
                        return (
                            <div>
                                {range[0]}-{range[1]} trên {total} items
                            </div>
                        );
                    },
                }}
                headerTitle="Bảng người dùng"
                toolBarRender={() => [
                    <Button
                        key="add-new-button"
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => {
                            handleCreateUser();
                        }}
                    >
                        Thêm mới
                    </Button>,
                ]}
            />
            <ViewUser openViewUser={openViewUser} setOpenViewUser={setOpenViewUser} userView={userView} />
            <UpdateUser
                openUpdateUser={openUpdateUser}
                setOpenUpdateUser={setOpenUpdateUser}
                userUpdate={userUpdate}
                refreshTable={refreshTable}
            />
            <CreateUser
                openCreateUser={openCreateUser}
                setOpenCreateUser={setOpenCreateUser}
                refreshTable={refreshTable}
            />
        </>
    );
};

export default TableUser;
