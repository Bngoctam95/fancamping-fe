import { useCurrentApp } from 'hooks/useCurrentApp';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from 'components/blog/card';
import { getAllPostsAPI } from 'services/api';

const BlogSection = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [displayedBlogs, setDisplayedBlogs] = useState<IPostTable[]>([]);
    const { isAuthenticated } = useCurrentApp();

    const fetchAllBlogs = async () => {
        try {
            setIsLoading(true);
            const res = await getAllPostsAPI(`type=blog&status=published`);
            if (res?.data) {
                setDisplayedBlogs(res.data.slice(0, 6));
            }
        } catch (error) {
            console.error('Error fetching equipment categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBlogs();
    }, []);

    return (
        <section className="py-16 bg-canvas">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold font-montserrat text-forest mb-4">Cộng đồng Fancamping</h2>
                    <p className="text-lg text-charcoal max-w-3xl mx-auto">
                        Đọc các bài viết từ các camper và chia sẻ trải nghiệm của bạn với cộng đồng.
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 animate-pulse"
                            >
                                <div className="h-48 bg-gray-300"></div>
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-300 mr-4"></div>
                                        <div>
                                            <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                                            <div className="h-3 bg-gray-300 rounded w-16"></div>
                                        </div>
                                    </div>
                                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-4 bg-gray-300 rounded w-8"></div>
                                            <div className="h-4 bg-gray-300 rounded w-8"></div>
                                        </div>
                                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : displayedBlogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayedBlogs.map((blog) => (
                            <BlogCard key={blog._id} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-lg mb-6">
                            Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!
                        </p>
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link to={isAuthenticated ? '/my-blog' : '/login'}>
                        <button className="bg-primary hover:bg-primary-hover font-montserrat text-white font-semibold text-sm px-4 py-3 rounded-md">
                            Chia sẻ trải nghiệm của bạn
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
