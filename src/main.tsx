import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.scss';
import './styles/editor.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Layout from '@/layout.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from 'pages/client/home.tsx';
import BlogPage from 'pages/client/blog.tsx';
import LoginPage from 'pages/client/auth/login.tsx';
import RegisterPage from 'pages/client/auth/register.tsx';
import RentalPage from 'pages/client/rental.tsx';
import ArticlePage from 'pages/client/article.tsx';
import { App, ConfigProvider } from 'antd';
import { AppProvider } from 'context/app.context';
import LayoutAdmin from 'components/layout/layout.admin';
import DashboardPage from 'pages/admin/dashboard';
import ManaUserPage from 'pages/admin/manage.user';
import ManaOrderPage from 'pages/admin/manage.order';
import ProfileAdmin from 'pages/admin/profile.admin';
import SettingAdmin from 'pages/admin/setting.admin';
import ProtectedRoute from 'components/auth';
import { HelmetProvider } from 'react-helmet-async';
import ManaProductPage from 'pages/admin/manage.product';
import ManaCategoryPage from 'pages/admin/manage.category';
import viVN from 'antd/locale/vi_VN';
import RentalDetailPage from 'pages/client/rental.detail';
import MyBlogLayout from 'pages/client/my-blog/layout';
import MyBlogListPage from 'pages/client/my-blog/list';
import WriteBlogPage from 'pages/client/my-blog/write';
import EditBlogPage from 'pages/client/my-blog/edit';
import MyBlogHomePage from 'pages/client/my-blog/home';
import ManaPostPage from 'pages/admin/manage.post';
import ScrollToTop from 'components/ScrollToTop';
import ProfilePage from 'pages/client/profile';
import BlogDetailPage from 'pages/client/blog.detail';
import MyBlogPreviewPage from 'pages/client/my-blog/view';
import NotFoundPage from 'pages/notfound.page';
import MyArticlesLayout from 'pages/client/my-articles/layout';
import MyArticlesHomePage from 'pages/client/my-articles/home';
import MyArticlesListPage from 'pages/client/my-articles/list';
import WriteArticlePage from 'pages/client/my-articles/write';
import EditArticlePage from 'pages/client/my-articles/edit';
import MyArticlesPreviewPage from 'pages/client/my-articles/view';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <>
                <ScrollToTop />
                <Layout />
            </>
        ),
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: '/rental',
                element: <RentalPage />,
            },
            {
                path: '/rental/:slug',
                element: <RentalDetailPage />,
            },
            {
                path: '/blog',
                element: <BlogPage />,
            },
            {
                path: '/blog/:slug',
                element: <BlogDetailPage />,
            },
            {
                path: '/article',
                element: <ArticlePage />,
            },
            {
                path: '/profile',
                element: <ProfilePage />,
            },
        ],
    },
    {
        path: '/login',
        element: (
            <>
                <ScrollToTop />
                <LoginPage />
            </>
        ),
    },
    {
        path: '/register',
        element: (
            <>
                <ScrollToTop />
                <RegisterPage />
            </>
        ),
    },
    {
        path: 'admin',
        element: (
            <>
                <ScrollToTop />
                <LayoutAdmin />
            </>
        ),
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'product',
                element: (
                    <ProtectedRoute>
                        <ManaProductPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'category',
                element: (
                    <ProtectedRoute>
                        <ManaCategoryPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'user',
                element: (
                    <ProtectedRoute>
                        <ManaUserPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'order',
                element: (
                    <ProtectedRoute>
                        <ManaOrderPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'profile',
                element: (
                    <ProtectedRoute>
                        <ProfileAdmin />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'settings',
                element: (
                    <ProtectedRoute>
                        <SettingAdmin />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'post',
                element: (
                    <ProtectedRoute>
                        <ManaPostPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: '/my-blog',
        element: (
            <>
                <ScrollToTop />
                <ProtectedRoute>
                    <MyBlogLayout />
                </ProtectedRoute>
            </>
        ),
        children: [
            {
                index: true,
                element: <MyBlogHomePage />,
            },
            {
                path: 'list',
                element: <MyBlogListPage />,
            },
            {
                path: 'write',
                element: <WriteBlogPage />,
            },
            {
                path: ':id/edit',
                element: <EditBlogPage />,
            },
            {
                path: ':id/view',
                element: <MyBlogPreviewPage />,
            },
        ],
    },
    {
        path: '/my-articles',
        element: (
            <>
                <ScrollToTop />
                <ProtectedRoute>
                    <MyArticlesLayout />
                </ProtectedRoute>
            </>
        ),
        children: [
            {
                index: true,
                element: <MyArticlesHomePage />,
            },
            {
                path: 'list',
                element: <MyArticlesListPage />,
            },
            {
                path: 'write',
                element: <WriteArticlePage />,
            },
            {
                path: ':id/edit',
                element: <EditArticlePage />,
            },
            {
                path: ':id/view',
                element: <MyArticlesPreviewPage />,
            },
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    }
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <HelmetProvider>
            <App>
                <AppProvider>
                    <ConfigProvider locale={viVN}>
                        <RouterProvider router={router} />
                    </ConfigProvider>
                </AppProvider>
            </App>
        </HelmetProvider>
    </StrictMode>
);
