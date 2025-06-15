import { Outlet } from "react-router-dom";
import BlogHeader from "components/layout/blog.header";

const MyBlogLayout = () => {
    return (
        <div className="flex flex-col">
            <div className="flex flex-col">
                <BlogHeader />
                <Outlet />
            </div>
        </div>
    )
}

export default MyBlogLayout;