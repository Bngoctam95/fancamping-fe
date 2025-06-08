import { FileTextOutlined, ShopOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import EquipmentCategory from "@/components/admin/category/equipment/table.category";

const LayoutCategory = () => {
    return (
        <Tabs
            defaultActiveKey="1"
            items={[
                {
                    key: '1',
                    label: 'Thiết bị cắm trại',
                    children: <EquipmentCategory />,
                    icon: <ShopOutlined />,
                },
                {
                    key: '2',
                    label: 'Bài viết',
                    children: 'Bài viết',
                    icon: <FileTextOutlined />,
                }
            ]}
        />
    )
}

export default LayoutCategory;