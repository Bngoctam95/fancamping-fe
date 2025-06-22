import ArticleHeader from "components/layout/article.header";
import { Outlet } from "react-router-dom";

const MyArticlesLayout = () => {
    return (
        <div className="flex flex-col">
            <div className="flex flex-col">
                <ArticleHeader />
                <Outlet />
            </div>
        </div>
    )
}

export default MyArticlesLayout;