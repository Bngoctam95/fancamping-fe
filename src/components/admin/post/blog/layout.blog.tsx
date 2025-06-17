import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import PendingTable from "components/admin/post/blog/pending/pending.table";
import PublishedTable from "components/admin/post/blog/published/published.table";


const LayoutBlog = () => {
    return (
        <Tabs
            defaultActiveKey="1"
            items={[
                {
                    key: '1',
                    label: 'Chờ phê duyệt',
                    children: <PendingTable />,
                    icon: <ClockCircleOutlined />,
                },
                {
                    key: '2',
                    label: 'Đã xuất bản',
                    children: <PublishedTable />,
                    icon: <CheckCircleOutlined />,
                }
            ]}
        />
    )
}

export default LayoutBlog;