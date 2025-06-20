import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import BlogFilters from 'components/blog/filters';
import { useEffect, useMemo, useState } from 'react';
import { getAllPostsAPI } from 'services/api';
import { Loader2 } from 'lucide-react';
import BlogCard from '@/components/blog/card';

const BlogPage = () => {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
    const [allBlogs, setAllBlogs] = useState<IPostTable[]>([]);
    const [isLoadingBlogs, setIsLoadingBlogs] = useState<boolean>(true);
    const fetchAllBlogs = async () => {
        const query = 'page=1&limit=100';
        const res = await getAllPostsAPI(query);
        if (res?.data) {
            setAllBlogs(res.data);
            setIsLoadingBlogs(false);
        } else {
            setAllBlogs([]);
            setIsLoadingBlogs(false);
        }
    };

    useEffect(() => {
        fetchAllBlogs();
    }, []);

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
    };

    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    //Filter equipment
    const filteredBlogs = useMemo(() => {
        let result = [...allBlogs];

        // Filter by category
        if (selectedCategoryId !== 'all') {
            result = result.filter((item) => item.categoryId._id === selectedCategoryId);
        }

        // Filter by search
        if (searchValue) {
            const searchLower = searchValue.toLowerCase();
            result = result.filter(
                (item) =>
                    item.title.toLowerCase().includes(searchLower) || item.subTitle?.toLowerCase().includes(searchLower)
            );
        }
        return result;
    }, [allBlogs, selectedCategoryId, searchValue]);

    return (
        <>
            <Helmet>
                <title>
                    {t('siteName')} | {t('blog.hero.title')}
                </title>
                <meta name="description" content={t('blog.hero.subtitle')} />
                <meta property="og:title" content={`${t('siteName')} | ${t('blog.hero.title')}`} />
                <meta property="og:description" content={t('blog.hero.subtitle')} />
                <meta property="og:type" content="website" />
            </Helmet>
            <div className="py-12 bg-white">
                <div className="container mx-auto px-6">
                    <BlogFilters
                        onCategoryChange={handleCategoryChange}
                        onSearch={handleSearch}
                        searchValue={searchValue}
                    />
                </div>
                <div className="container mx-auto px-6">
                    {isLoadingBlogs ? (
                        <div className="flex justify-center items-center min-h-[400px]">
                            <Loader2 className="h-12 w-12 animate-spin text-forest" />
                        </div>
                    ) : filteredBlogs.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBlogs.map((item) => (
                                <BlogCard key={item._id} blog={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <h3 className="text-xl font-semibold font-montserrat mb-2">No blog found</h3>
                            <p className="text-gray-600">Try adjusting your filters or search terms</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BlogPage;
