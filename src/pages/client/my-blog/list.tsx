import { getMyBlogsAPI } from "services/api";
import { useEffect, useState } from "react";
import PostCard from "@/components/my-posts/post.card";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PostCardSkeleton = () => (
    <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
        <div className="h-7 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="flex gap-2 mb-3">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="flex gap-2 mb-3">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
        <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
    </div>
);

const EmptyState = ({ onCreateNew }: { onCreateNew: () => void }) => (
    <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">Chưa có bài viết nào</h3>
        <p className="text-gray-600 mb-6">Hãy bắt đầu chia sẻ câu chuyện của bạn</p>
        <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-button text-white font-montserrat text-sm font-semibold rounded-lg hover:bg-button-hover transition-colors"
        >
            <PlusCircle size={20} />
            Tạo bài viết mới
        </button>
    </div>
);

const MyBlogListPage = () => {
    const [myBlogs, setMyBlogs] = useState<IPostTable[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyBlogs = async () => {
            try {
                setIsLoading(true);
                const res = await getMyBlogsAPI();
                if (res?.data) {
                    setMyBlogs(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch blogs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyBlogs();
    }, []);

    const handleCreateNew = () => {
        navigate("/my-blog/write");
    };

    const handleEdit = (id: string) => {
        navigate(`/my-blog/${id}/   edit`);
    };

    const handleDelete = async (id: string) => {
        // TODO: Implement delete API call
        console.log("Delete post:", id);
    };


    return (
        <section className="py-8 bg-canvas min-h-screen">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Bài viết của tôi</h1>
                    <button
                        onClick={() => navigate("/my-blog")}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-button text-white font-montserrat text-sm font-semibold rounded-lg hover:bg-button-hover transition-colors"
                    >
                        Quay lại Bảng điều khiển
                    </button>
                </div>

                <div className="grid gap-6">
                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => <PostCardSkeleton key={i} />)
                    ) : myBlogs.length === 0 ? (
                        <EmptyState onCreateNew={handleCreateNew} />
                    ) : (
                        myBlogs.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default MyBlogListPage;