import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { useState, useRef } from 'react';
import PendingTable from 'components/admin/post/blog/pending/pending.table';
import PublishedTable from 'components/admin/post/blog/published/published.table';

const LayoutBlog = () => {
    const [activeKey, setActiveKey] = useState('1');
    const publishedTableRef = useRef<{ refreshData: () => void }>(null);

    const handleTabChange = (key: string) => {
        setActiveKey(key);
        // Refresh data when switching to published tab
        if (key === '2' && publishedTableRef.current) {
            publishedTableRef.current.refreshData();
        }
    };

    return (
        <Tabs
            activeKey={activeKey}
            onChange={handleTabChange}
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
                    children: <PublishedTable ref={publishedTableRef} />,
                    icon: <CheckCircleOutlined />,
                },
            ]}
        />
    );
};

export default LayoutBlog;
