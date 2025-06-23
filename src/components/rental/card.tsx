import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface RentalCardProps {
    equipment: IProductTable;
}

const RentalCard = ({ equipment }: RentalCardProps) => {
    const { t } = useTranslation();

    const formatPrice = (price: number) => {
        return `${price.toLocaleString('vi-VN')} VND`;
    };

    const formatRating = (rating: number | undefined) => {
        if (!rating) return 0;
        return (rating / 100).toFixed(1);
    };

    const truncateText = (text: string, maxLength: number = 100) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    const urlEquipment = `${import.meta.env.VITE_BACKEND_URL}uploads/products/thumbnails/${equipment?.thumbnail}`;

    return (
        <div className="bg-[#eaeded] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
            <div className="relative h-56">
                <img
                    src={urlEquipment}
                    alt={equipment.thumbnail}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
                <div className="absolute top-4 right-4 bg-campfire text-white text-sm font-semibold py-1 px-3 rounded-full">
                    {formatPrice(equipment.price)}/{t('equipment.featured.day')}
                </div>
            </div>
            <div className="p-6">
                <h3 className="font-montserrat font-bold text-primary text-lg mb-2">{equipment.name}</h3>
                <p className="text-base mb-4 text-gray-700">{truncateText(equipment.shortDescription)}</p>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="flex items-center text-sm text-gray-600">
                            <Star className="inline mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                            {formatRating(equipment.ratings.average)} ({equipment.ratings.count}{' '}
                            {t('equipment.featured.reviews')})
                        </span>
                    </div>
                    <Link to={`/rental/${equipment.slug}`}>
                        <button className="bg-button hover:bg-button-hover font-montserrat text-white font-semibold text-sm px-4 py-2 rounded-md">
                            {t('equipment.featured.rentNow')}
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RentalCard;
