import PostCard from "@/components/my-posts/post.card";
import { getMyBlogsAPI } from "@/services/api";
import { useCurrentApp } from "hooks/useCurrentApp";
import { Calendar, Edit3, FileText, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

const MyBlogHomePage = () => {
    const { user } = useCurrentApp();
    const [myBlogs, setMyBlogs] = useState<IPostTable[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const recentPosts = myBlogs.slice(0, 4);

    return (
        <section className="py-8 bg-canvas min-h-screen">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-5xl font-bold mb-6">
                            Chào mừng, {user?.name || 'Bạn'}!
                        </h2>
                        <p className="text-xl mb-8 font-montserrat">
                            Tạo, chia sẻ và lưu trữ kỷ niệm của bạn với nền tảng blog đẹp nhất
                        </p>
                    </div>
                </div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md border border-sage/10">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-forest-dark/60">Tổng bài viết</p>
                                    <p className="text-2xl font-bold text-forest">{0}</p>
                                </div>
                                <FileText className="h-8 w-8 text-sage" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md border border-sage/10">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-forest-dark/60">Bài viết tháng này</p>
                                    <p className="text-2xl font-bold text-campfire">{0}</p>
                                </div>
                                <Calendar className="h-8 w-8 text-campfire" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md border border-sage/10">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-forest-dark/60">Bài viết nháp</p>
                                    <p className="text-2xl font-bold text-sage">{0}</p>
                                </div>
                                <Edit3 className="h-8 w-8 text-sage" />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold mb-8 text-center font-montserrat">
                        Bài viết gần đây
                    </h3>
                    <div className="grid gap-8 md:grid-cols-2">
                        {recentPosts.map((post) => (
                            <PostCard key={post._id} post={post} isShowAction={false} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyBlogHomePage;