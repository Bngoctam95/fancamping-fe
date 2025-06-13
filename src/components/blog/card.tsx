import { Link } from 'react-router-dom';
import { Heart, MessageSquare } from 'lucide-react';
import { formatDate } from '@/services/helper';

interface Blog {
    id: number;
    title: string;
    subTitle: string;
    imageUrl: string;
    publishedAt: string;
    author: {
        id: number;
        name: string;
    };
    comments: number;
    likes: number;
}

const BlogCard = ({ blog }: { blog: Blog }) => {
    // Truncate blog content for preview
    const truncateContent = (content: string, maxLength = 120) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
            <div className="h-48 overflow-hidden">
                <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="Profile picture"
                        className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                        <p className="font-semibold font-montserrat mb-0">{blog.author.name || 'Camper'}</p>
                        <p className="text-sm text-gray-600 mb-0">{formatDate(blog.publishedAt)}</p>
                    </div>
                </div>
                <h3 className="text-xl font-semibold font-montserrat mb-2 min-h-[48px]">{blog.title}</h3>
                <p className="text-charcoal mb-4">{truncateContent(blog.subTitle)}</p>
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center text-sm text-gray-600">
                            <Heart className="mr-1 h-4 w-4" />
                            {blog.likes}
                        </span>
                        <span className="flex items-center text-sm text-gray-600">
                            <MessageSquare className="mr-1 h-4 w-4" />
                            {blog.comments}
                        </span>
                    </div>
                    <Link to={`/blogs/${blog.id}`}>
                        <button className="text-forest hover:text-campfire font-medium font-montserrat">
                            Read More
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
