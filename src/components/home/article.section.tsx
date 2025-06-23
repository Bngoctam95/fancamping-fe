import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPostsAPI } from 'services/api';
import { ArrowRight } from 'lucide-react';
import ArticleCard from '../article/card';

const ArticleSection = () => {
    const [featuredArticle, setFeaturedArticle] = useState<IPostTable[]>([]);
    const [regularArticles, setRegularArticles] = useState<IPostTable[]>([]);

    const fetchFeaturedArticle = async () => {
        try {
            const res = await getAllPostsAPI(`type=article&status=published`);
            if (res?.data) {
                setFeaturedArticle(res.data.slice(0, 2));
                setRegularArticles(res.data.slice(2, 5));
            }
        } catch (error) {
            console.error('Error fetching equipment categories:', error);
        }
    };

    useEffect(() => {
        fetchFeaturedArticle();
    }, []);

    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-6">
                <h2 className="font-montserrat font-bold text-3xl text-foreground mb-2">
                    Hướng Dẫn Cắm Trại Chuyên Nghiệp
                </h2>
                <p className="font-opensans text-gray-600 dark:text-gray-300 max-w-2xl mb-10">
                    Nội dung ngoài trời chuyên nghiệp giúp bạn lên kế hoạch cho chuyến đi tiếp theo
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Featured Guide */}
                    <div className="grid grid-cols-1 gap-6">
                        {featuredArticle.map((article) => (
                            <ArticleCard
                                key={article._id}
                                id={article._id}
                                title={article.title}
                                subTitle={article.subTitle}
                                imageUrl={article.thumbnail}
                                createdAt={article.createdAt}
                                author={article.authorId}
                                category={article.categoryId?.name}
                                variant="featured"
                            />
                        ))}
                    </div>
                    {/* Regular Guides */}
                    <div className="grid grid-cols-1 gap-6">
                        {regularArticles.map((article) => (
                            <ArticleCard
                                key={article._id}
                                id={article._id}
                                title={article.title}
                                subTitle={article.subTitle}
                                imageUrl={article.thumbnail}
                                createdAt={article.createdAt}
                                author={article.authorId}
                                category={article.categoryId?.name}
                                variant="compact"
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/guides">
                        <a className="font-montserrat font-semibold text-primary hover:text-primary/90 inline-flex items-center">
                            Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ArticleSection;
