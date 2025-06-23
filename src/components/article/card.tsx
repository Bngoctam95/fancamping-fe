import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { formatDate } from 'services/helper';

interface IAuthor {
    _id: string;
    name: string;
    avatar: string;
}

interface IArticleCard {
    id: string;
    title: string;
    subTitle: string;
    imageUrl: string;
    createdAt: Date;
    author: IAuthor;
    category: string;
    variant: 'featured' | 'compact' | 'default';
}
const ArticleCard = ({ id, title, subTitle, imageUrl, createdAt, author, category, variant }: IArticleCard) => {
    const urlAvatar = author?.avatar
        ? `${import.meta.env.VITE_BACKEND_URL}uploads/users/${author?.avatar}`
        : `${import.meta.env.VITE_BACKEND_URL}uploads/users/default-avatar.png`;

    const urlImage = imageUrl
        ? `${import.meta.env.VITE_BACKEND_URL}uploads/posts/thumbnails/${imageUrl}`
        : `${import.meta.env.VITE_BACKEND_URL}uploads/posts/thumbnails/default-thumbnail.png`;

    return variant === 'featured' ? (
        <article className="bg-[#ebf5fb] dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row">
            <img src={urlImage} className="w-full md:w-2/5 h-60 md:h-auto object-cover" />
            <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                    <div className="flex items-center mb-4">
                        <span className="bg-[#789b86] text-white px-2 py-1 rounded-2xl text-sm">{category}</span>
                    </div>
                    <h3 className="font-montserrat font-bold text-xl mb-3">
                        <Link to={`/guides/${id}`}>{title}</Link>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-6">{subTitle}</p>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="flex items-center mb-4">
                            <img src={urlAvatar} alt="Profile picture" className="w-10 h-10 rounded-full mr-4" />
                            <div>
                                <p className="font-semibold font-montserrat mb-0">{author?.name}</p>
                                <p className="text-sm text-gray-600 mb-0">{formatDate(createdAt)}</p>
                            </div>
                        </div>
                    </div>
                    <Link to={`/guides/${id}`}>
                        <a className="text-primary hover:text-primary/90">
                            <ArrowRight className="h-5 w-5" />
                        </a>
                    </Link>
                </div>
            </div>
        </article>
    ) : (
        <article className="bg-[#ebf5fb] dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow flex">
            <img src={urlImage} className="w-1/3 object-cover" />
            <div className="p-4 flex-grow">
                <h3 className="font-montserrat font-semibold text-lg mb-2">
                    <Link to={`/guides/${id}`}>{title}</Link>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">{subTitle}</p>
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                        <div className="flex items-center mb-4">
                            <img src={urlAvatar} alt="Profile picture" className="w-10 h-10 rounded-full mr-4" />
                            <div>
                                <p className="font-semibold font-montserrat mb-0">{author?.name}</p>
                                <p className="text-sm text-gray-600 mb-0">{formatDate(createdAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ArticleCard;
