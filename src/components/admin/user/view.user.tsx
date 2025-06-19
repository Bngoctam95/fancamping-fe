import { formatDate } from 'services/helper';
import { Avatar, Badge, Descriptions, Drawer } from 'antd';
import type { DescriptionsProps } from 'antd/lib';
import { useCurrentApp } from 'hooks/useCurrentApp';
import { UserOutlined } from '@ant-design/icons';

interface IViewUserProps {
    openViewUser: boolean;
    setOpenViewUser: (open: boolean) => void;
    userView: IUserTable | null;
}

const ViewUser = ({ openViewUser, setOpenViewUser, userView }: IViewUserProps) => {
    const { user } = useCurrentApp();
    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;
    const items: DescriptionsProps['items'] = [
        {
            label: 'Id',
            children: userView?._id,
        },
        {
            label: 'Họ và tên',
            children: userView?.name,
        },
        {
            label: 'Email',
            children: userView?.email,
        },
        {
            label: 'Số điện thoại',
            children: userView?.phone,
        },
        {
            label: 'Vai trò',
            children: <Badge status="processing" text={userView?.role} />,
        },
        {
            label: 'Ảnh đại diện',
            children: <Avatar src={urlAvatar} icon={<UserOutlined />} />,
        },
        {
            label: 'Ngày tạo',
            children: formatDate(userView?.createdAt),
        },
        {
            label: 'Ngày cập nhật',
            children: formatDate(userView?.updatedAt),
        },
    ];

    return (
        <Drawer
            title="Thông tin người dùng"
            width={720}
            onClose={() => setOpenViewUser(false)}
            open={openViewUser}
            styles={{
                body: {
                    paddingBottom: 80,
                },
            }}
        >
            <Descriptions title="Thông tin người dùng" bordered items={items} column={2} />
        </Drawer>
    );
};

export default ViewUser;
