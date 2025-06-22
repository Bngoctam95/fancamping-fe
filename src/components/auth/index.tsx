import { Button, Result } from "antd";
import { useCurrentApp } from "hooks/useCurrentApp";
import { useLocation, Link } from "react-router-dom";

interface IProps {
    children: React.ReactNode
}

const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp();
    const location = useLocation();

    if (isAuthenticated === false) {
        return (
            <Result
                status="404"
                title="Not Login"
                subTitle="Bạn cần đăng nhập truy cập được trang này."
                extra={<Button type="primary"><Link to="/">Back Home</Link></Button>}
            />
        )
    }

    const isAdminRoute = location.pathname.includes("admin");
    if (isAdminRoute === true && isAuthenticated === true) {
        const role = user?.role;
        if (role === "user") {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Bạn không có quyền truy cập trang này."
                    extra={<Button type="primary"><Link to="/">Back Home</Link></Button>}
                />
            )
        }
    }

    const isMyBlogRoute = location.pathname.includes("my-blog");
    if (isMyBlogRoute === true && isAuthenticated === true) {
        const role = user?.role;
        if (role === "mod" || role === "admin" || role === "user") {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Bạn không có quyền truy cập trang này."
                    extra={<Button type="primary"><Link to="/">Back Home</Link></Button>}
                />
            )
        }
    }

    const isMyArticlesRoute = location.pathname.includes("my-articles");
    if (isMyArticlesRoute === true && isAuthenticated === true) {
        const role = user?.role;
        if (role === "user") {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Bạn không có quyền truy cập trang này."
                    extra={<Button type="primary"><Link to="/">Back Home</Link></Button>}
                />
            )
        }
    }

    return (
        <>
            {props.children}
        </>
    )
}

export default ProtectedRoute;