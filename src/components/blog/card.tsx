import { Link } from 'react-router-dom';
import { Heart, MessageSquare } from 'lucide-react';
import { formatDate } from '@/services/helper';

const BlogCard = ({ blog }: { blog: IPostTable }) => {
    // Truncate blog content for preview
    const truncateContent = (content: string, maxLength = 120) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const urlThumbnail = `${import.meta.env.VITE_BACKEND_URL}uploads/posts/thumbnails/${blog.thumbnail}`;

    const urlAvatar = blog?.authorId?.avatar
        ? `${import.meta.env.VITE_BACKEND_URL}uploads/users/${blog.authorId?.avatar}`
        : `${import.meta.env.VITE_BACKEND_URL}uploads/users/default-avatar.png`;

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
            <div className="h-48 overflow-hidden">
                <img
                    src={urlThumbnail}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <img src={urlAvatar} alt="Profile picture" className="w-10 h-10 rounded-full mr-4" />
                    <div>
                        <p className="font-semibold font-montserrat mb-0">{blog.authorId?.name}</p>
                        <p className="text-sm text-gray-600 mb-0">{formatDate(blog.createdAt)}</p>
                    </div>
                </div>
                <h3 className="text-lg font-semibold font-montserrat mb-2 min-h-[50px]">{blog.title}</h3>
                <p className="font-montserrat text-charcoal mb-4">{truncateContent(blog.subTitle)}</p>
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center text-sm text-gray-600">
                            <Heart className="mr-1 h-4 w-4" />
                            {blog.likeCount}
                        </span>
                        <span className="flex items-center text-sm text-gray-600">
                            <MessageSquare className="mr-1 h-4 w-4" />
                            {blog.commentCount}
                        </span>
                    </div>
                    <Link to={`/blog/${blog.slug}`}>
                        <button className="text-campfire hover:text-secondary font-semibold text-base font-montserrat">
                            Đọc thêm
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
