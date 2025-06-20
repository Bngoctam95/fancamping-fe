import { getPostBySlugAPI } from 'services/api';
import { Loader2, Calendar, Eye, Heart, MessageCircle, Share2, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDate } from 'services/helper';
import ContentDetail from 'components/blog/content.detail';

const BlogDetailPage = () => {
    const { slug } = useParams();
    const [postDetail, setPostDetail] = useState<IPostTable | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState<number>(postDetail?.likeCount || 0);

    const urlThumbnail = postDetail?.thumbnail
        ? `${import.meta.env.VITE_BACKEND_URL}uploads/posts/thumbnails/${postDetail?.thumbnail}`
        : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop';

    const urlAvatar = postDetail?.authorId.avatar
        ? `${import.meta.env.VITE_BACKEND_URL}uploads/users/${postDetail?.authorId.avatar}`
        : `${import.meta.env.VITE_BACKEND_URL}uploads/users/default-avatar.png`;
    useEffect(() => {
        const fetchPostDetail = async () => {
            const res = await getPostBySlugAPI(slug as string);
            if (res.data) {
                setPostDetail(res.data);
                setIsLoading(false);
            }
        };
        fetchPostDetail();
    }, [slug]);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    };

    const handleFocusComment = () => {
        const commentInput = document.getElementById('comment-input');
        if (commentInput) {
            commentInput.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-12 w-12 animate-spin text-forest" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-canvas">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Article Container */}
                <div className="bg-white rounded-2xl shadow-xl mb-4 overflow-hidden">
                    {/* Header Image */}
                    <div className="relative">
                        <img src={urlThumbnail} alt={postDetail?.title} className="w-full h-96 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-3">
                                {postDetail?.categoryId.name}
                            </div>
                            <h1 className="text-3xl md:text-3xl font-bold text-white mb-2 leading-tight">
                                {postDetail?.title}
                            </h1>

                            {/* Article Meta & Actions in Thumbnail */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                                {/* Author & Date */}
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <img
                                            src={urlAvatar}
                                            alt={postDetail?.authorId.name}
                                            className="w-full h-full rounded-full"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white text-base mb-0">
                                            {postDetail?.authorId.name}
                                        </p>
                                        <div className="flex items-center text-sm text-gray-300 space-x-2">
                                            <Calendar className="w-3 h-3" />
                                            <span>{formatDate(postDetail?.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats & Actions */}
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1 text-white/80">
                                        <Eye className="size-5" />
                                        <span className="text-sm">{postDetail?.viewCount}</span>
                                    </div>

                                    <button
                                        onClick={handleLike}
                                        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all text-sm ${
                                            isLiked
                                                ? 'bg-red-500/80 text-white hover:bg-red-500'
                                                : 'bg-white/20 text-white hover:bg-white/30'
                                        }`}
                                    >
                                        <Heart className={`size-5 ${isLiked ? 'fill-current' : ''}`} />
                                        <span>{likeCount}</span>
                                    </button>

                                    <button
                                        onClick={handleFocusComment}
                                        className="flex items-center space-x-1 px-3 py-1 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all text-sm"
                                    >
                                        <MessageCircle className="size-5" />
                                        <span>0</span>
                                    </button>

                                    <button className="p-1 text-white/80 hover:text-white transition-all">
                                        <Share2 className="size-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-8">
                        <p className="text-base font-montserrat text-gray-500 mb-4 italic leading-7">
                            {postDetail?.subTitle}
                        </p>
                        <ContentDetail content={postDetail?.content || ''} />

                        {/* Tags */}
                        <div className="border-t border-gray-200 pt-2 mt-5">
                            <div className="flex items-center space-x-2 mb-3">
                                <Tag className="w-5 h-5 text-gray-600" />
                                <h3 className="font-semibold text-gray-800">Tags</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {postDetail?.tags.map((tag: string, index: number) => (
                                    <span
                                        key={index}
                                        className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:from-blue-100 hover:to-purple-100 transition-all cursor-pointer"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 font-montserrat">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Bình luận</h3>

                    {/* Comment Form */}
                    <div className="mb-6">
                        <div className="mb-4">
                            <textarea
                                id="comment-input"
                                placeholder="Viết bình luận của bạn..."
                                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={4}
                            />
                        </div>
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            Gửi bình luận
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;
