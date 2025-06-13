import { useCurrentApp } from 'hooks/useCurrentApp';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from 'components/blog/card';

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

const BlogSection = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [displayedBlogs, setDisplayedBlogs] = useState<Blog[]>([]);
    const { isAuthenticated } = useCurrentApp();

    // Blog dummy data
    const dummyBlogs = [
        {
            id: 1,
            title: 'Điểm đến nổi tiếng ở Việt Nam',
            subTitle:
                'Điểm đến nổi tiếng ở Việt Nam, được nhiều người yêu thích vì vẻ đẹp tự nhiên và không khí trong lành.',
            imageUrl:
                'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            publishedAt: '2021-01-01',
            author: {
                id: 1,
                name: 'Nguyễn Văn A',
            },
            comments: 10,
            likes: 10,
        },
        {
            id: 2,
            title: 'Điểm đến nổi tiếng ở Việt Nam',
            subTitle:
                'Điểm đến nổi tiếng ở Việt Nam, được nhiều người yêu thích vì vẻ đẹp tự nhiên và không khí trong lành.',
            imageUrl:
                'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            publishedAt: '2021-01-01',
            author: {
                id: 2,
                name: 'Nguyễn Văn B',
            },
            comments: 10,
            likes: 10,
        },
        {
            id: 3,
            title: 'Điểm đến nổi tiếng ở Việt Nam',
            subTitle:
                'Điểm đến nổi tiếng ở Việt Nam, được nhiều người yêu thích vì vẻ đẹp tự nhiên và không khí trong lành.',
            imageUrl:
                'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            publishedAt: '2021-01-01',
            author: {
                id: 3,
                name: 'Nguyễn Văn A',
            },
            comments: 10,
            likes: 10,
        },
        {
            id: 4,
            title: 'Điểm đến nổi tiếng ở Việt Nam',
            subTitle:
                'Điểm đến nổi tiếng ở Việt Nam, được nhiều người yêu thích vì vẻ đẹp tự nhiên và không khí trong lành.',
            imageUrl:
                'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            publishedAt: '2021-01-01',
            author: {
                id: 4,
                name: 'Nguyễn Văn B',
            },
            comments: 10,
            likes: 10,
        },
        {
            id: 5,
            title: 'Điểm đến nổi tiếng ở Việt Nam',
            subTitle:
                'Điểm đến nổi tiếng ở Việt Nam, được nhiều người yêu thích vì vẻ đẹp tự nhiên và không khí trong lành.',
            imageUrl:
                'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            publishedAt: '2021-01-01',
            author: {
                id: 5,
                name: 'Nguyễn Văn C',
            },
            comments: 10,
            likes: 10,
        },
        {
            id: 6,
            title: 'Điểm đến nổi tiếng ở Việt Nam',
            subTitle:
                'Điểm đến nổi tiếng ở Việt Nam, được nhiều người yêu thích vì vẻ đẹp tự nhiên và không khí trong lành.',
            imageUrl:
                'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            publishedAt: '2021-01-01',
            author: {
                id: 6,
                name: 'Nguyễn Văn D',
            },
            comments: 10,
            likes: 10,
        },
    ];

    useEffect(() => {
        setDisplayedBlogs(dummyBlogs);
        setIsLoading(false);
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
                            <BlogCard key={blog.id} blog={blog} />
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
                    <Link to={isAuthenticated ? '/article' : '/login'}>
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
