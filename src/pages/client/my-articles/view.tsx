import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPostByIdAPI } from '@/services/api';
import { Loader2 } from 'lucide-react';
import ContentDetail from '@/components/blog/content.detail';

const MyArticlesPreviewPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState<IPostTable | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState<string>('');

    useEffect(() => {
        if (post?.thumbnail) {
            setThumbnail(`${import.meta.env.VITE_BACKEND_URL}uploads/posts/thumbnails/${post.thumbnail}`);
        } else {
            setThumbnail('');
        }
    }, [post?.thumbnail]);

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true);
            const res = await getPostByIdAPI(id || '');
            if (res?.data) {
                setPost(res.data);
            }
            setIsLoading(false);
        };
        fetchPost();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <section className="py-8 bg-canvas min-h-screen">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold font-montserrat">Xem bài viết</h2>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Blog Info Section */}
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Thông tin bài viết</h3>

                            <div className="space-y-6">
                                {/* Thumbnail */}
                                <div>
                                    <label className="block text-base font-medium text-gray-700 mb-2">
                                        Ảnh Thumbnail
                                    </label>
                                    <img src={thumbnail} alt="Thumbnail" className="w-full h-auto" />
                                </div>
                                {/* Title */}
                                <div>
                                    <label className="block text-base font-medium text-gray-700 mb-2">Tiêu đề</label>
                                    <input
                                        type="text"
                                        placeholder="Nhập tiêu đề bài viết..."
                                        value={post?.title}
                                        disabled
                                        className="w-full text-base outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-3 bg-gray-50"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-base font-medium text-gray-700 mb-2">Mô tả ngắn</label>
                                    <textarea
                                        placeholder="Mô tả ngắn gọn về nội dung bài viết..."
                                        value={post?.subTitle}
                                        disabled
                                        className="w-full h-20 p-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base"
                                    />
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Tags */}
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-2">Tags</label>
                                        <div className="flex flex-wrap gap-2">
                                            {post?.tags.map((tag: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-2">
                                            Danh mục
                                        </label>
                                        <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                            {post?.categoryId?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Editor */}
                            <div className="mt-6">
                                <label className="block text-base font-medium text-gray-700 mb-2">Nội dung</label>
                                <ContentDetail content={post?.content || ''} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MyArticlesPreviewPage;
