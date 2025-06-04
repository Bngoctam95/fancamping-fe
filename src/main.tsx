import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.scss';
import Layout from '@/layout.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from 'pages/client/home.tsx';
import BlogPage from 'pages/client/blog.tsx';
import LoginPage from 'pages/client/auth/login.tsx';
import RegisterPage from 'pages/client/auth/register.tsx';
import RentalPage from 'pages/client/rental.tsx';
import ArticlePage from 'pages/client/article.tsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/rental",
        element: <RentalPage />,
      },
      {
        path: "/blog",
        element: <BlogPage />,
      },
      {
        path: "/article",
        element: <ArticlePage />,
      },
    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
