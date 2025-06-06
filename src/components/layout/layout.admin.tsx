import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { Avatar, Button, Col, Dropdown, Layout, Menu, Modal, Row, theme } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useCurrentApp } from 'hooks/useCurrentApp';
import { logoutAPI } from 'services/api';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from 'components/ui/language.switcher';
import { BookOutlined, DashboardOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ProductOutlined, SettingOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Tent } from 'lucide-react';

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { user, setUser, isAuthenticated, setIsAuthenticated } = useCurrentApp();
    const navigate = useNavigate();
    //const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    const { t } = useTranslation();

    const sidebarItems: MenuItem[] = [
        getItem(<Link to="/admin">{t('admin.dashboard')}</Link>, 'dashboard', <DashboardOutlined />),
        getItem(<Link to="/admin/user">{t('admin.manageUsers')}</Link>, 'user', <UserOutlined />),
        getItem(<Link to="/admin/product">{t('admin.manageProducts')}</Link>, 'product', <ProductOutlined />),
        getItem(<Link to="/admin/category">{t('admin.manageCategories')}</Link>, 'category', <BookOutlined />),
        getItem(<Link to="/admin/order">{t('admin.manageOrders')}</Link>, 'order', <ShoppingCartOutlined />),
    ];

    const profileDropdownItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: t('admin.profile'),
            icon: <UserOutlined />,
        },
        {
            key: 'settings',
            label: t('admin.settings'),
            icon: <SettingOutlined />,
        },
        {
            key: 'logout',
            label: t('admin.logout'),
            icon: <LogoutOutlined />,
            danger: true,
        },
    ];

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'logout') {
            setIsModalOpen(true);
        } else {
            navigate(e.key);
        }
    };

    const handleLogout = async () => {
        setLogoutLoading(true);
        const res = await logoutAPI();
        if (res.data) {
            setUser(null);
            setIsAuthenticated(false);
            setIsModalOpen(false);
            setLogoutLoading(false);
            navigate('/login');
        }
    };

    if (isAuthenticated === false) {
        return <Outlet />;
    }

    const isAdminRoute = location.pathname.includes('admin');
    if (isAdminRoute === true && isAuthenticated === true) {
        const role = user?.role;
        if (role === 'USER') {
            return <Outlet />;
        }
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div
                    className="demo-logo-vertical"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '64px',
                        gap: '8px',
                    }}
                >
                    <Tent className="text-secondary text-2xl" />
                    {!collapsed && <span className="font-montserrat font-bold text-xl text-white">{t('siteName')}</span>}
                </div>
                <Menu theme="dark" defaultSelectedKeys={[activeMenu]} mode="inline" items={sidebarItems} onClick={(e) => setActiveMenu(e.key)} />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <Row>
                        <Col span={12}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                        </Col>
                        <Col
                            span={12}
                            style={{
                                display: 'flex',
                                justifyContent: 'end',
                                alignItems: 'center',
                                gap: 10,
                            }}
                        >
                            <LanguageSwitcher />
                            <Dropdown
                                menu={{
                                    items: profileDropdownItems,
                                    onClick: handleMenuClick,
                                }}
                                trigger={['click']}
                                placement="bottomRight"
                                arrow
                            >
                                <Avatar
                                    style={{
                                        cursor: 'pointer',
                                        marginRight: 20,
                                    }}
                                    shape="square"
                                    size={40}
                                    icon={<UserOutlined />}
                                />
                            </Dropdown>
                            <Modal
                                title="Xác nhận đăng xuất"
                                open={isModalOpen}
                                onOk={handleLogout}
                                onCancel={() => setIsModalOpen(false)}
                                okText="Đăng xuất"
                                cancelText="Hủy"
                                confirmLoading={logoutLoading}
                            >
                                <p>Bạn có chắc chắn muốn đăng xuất?</p>
                            </Modal>
                        </Col>
                    </Row>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;
