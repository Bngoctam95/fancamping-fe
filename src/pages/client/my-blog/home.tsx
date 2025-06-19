import PostCard from '@/components/my-posts/post.card';
import { getMyBlogsAPI } from '@/services/api';
import { useCurrentApp } from 'hooks/useCurrentApp';
import { Calendar, CheckCircle, Clock, Edit3, FileText, Loader2, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const MyBlogHomePage = () => {
    const navigate = useNavigate();
    const { user } = useCurrentApp();
    const [myBlogs, setMyBlogs] = useState<IPostTable[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalDrafts, setTotalDrafts] = useState(0);
    const [totalPending, setTotalPending] = useState(0);
    const [totalPublished, setTotalPublished] = useState(0);
    const [totalPostsThisMonth, setTotalPostsThisMonth] = useState(0);

    useEffect(() => {
        const fetchMyBlogs = async () => {
            try {
                setIsLoading(true);
                const res = await getMyBlogsAPI();
                if (res?.data) {
                    setMyBlogs(res.data);
                }
            } catch (error) {
                console.error('Failed to fetch blogs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyBlogs();
    }, []);

    useEffect(() => {
        const totalPosts = myBlogs.length;
        const totalDrafts = myBlogs.filter((post) => post.status === 'draft').length;
        const totalPending = myBlogs.filter((post) => post.status === 'pending').length;
        const totalPublished = myBlogs.filter((post) => post.status === 'published').length;
        const totalPostsThisMonth = myBlogs.filter(
            (post) =>
                new Date(post.createdAt).getMonth() === new Date().getMonth() &&
                new Date(post.createdAt).getFullYear() === new Date().getFullYear()
        ).length;
        setTotalPosts(totalPosts);
        setTotalDrafts(totalDrafts);
        setTotalPending(totalPending);
        setTotalPublished(totalPublished);
        setTotalPostsThisMonth(totalPostsThisMonth);
    }, [myBlogs]);

    const recentPosts = myBlogs.slice(0, 4);

    const handleCreateNew = () => {
        navigate('/my-blog/write');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-12 w-12 animate-spin text-forest" />
            </div>
        );
    }

    return (
        <section className="py-8 bg-canvas min-h-screen">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-5xl font-bold mb-6">Chào mừng, {user?.name || 'Bạn'}!</h2>
                        <p className="text-xl mb-8 font-montserrat">
                            Tạo, chia sẻ và lưu trữ kỷ niệm của bạn với nền tảng blog đẹp nhất
                        </p>
                    </div>
                </div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md border border-sage/10">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-forest-dark/60">Tổng bài viết</p>
                                    <p className="text-2xl font-bold text-forest">{totalPosts}</p>
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
                                    <p className="text-2xl font-bold text-campfire">{totalPostsThisMonth}</p>
                                </div>
                                <Calendar className="h-8 w-8 text-campfire" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md border border-sage/10">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-forest-dark/60">Bài viết đã duyệt</p>
                                    <p className="text-2xl font-bold text-green-600">{totalPublished}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md border border-sage/10">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-forest-dark/60">Bài viết nháp</p>
                                    <p className="text-2xl font-bold text-gray-500">{totalDrafts}</p>
                                </div>
                                <Edit3 className="h-8 w-8 text-gray-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md border border-sage/10">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-forest-dark/60">Bài viết chờ duyệt</p>
                                    <p className="text-2xl font-bold text-yellow-500">{totalPending}</p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-500" />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold mb-8 text-center font-montserrat">Bài viết gần đây</h3>
                    {recentPosts.length === 0 ? (
                        <EmptyState onCreateNew={handleCreateNew} />
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2">
                            {recentPosts.map((post) => (
                                <PostCard key={post._id} post={post} isShowAction={false} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default MyBlogHomePage;
