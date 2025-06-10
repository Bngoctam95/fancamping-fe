import { Button } from 'antd';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RentalCardProps {
    equipment: IProductTable;
}

const RentalCard = ({ equipment }: RentalCardProps) => {
    // Format price from cents to dollars
    const formatPrice = (cents: number) => {
        return `$${(cents / 100).toFixed(2)}`;
    }; // Format rating from 0-500 to 0-5 stars
    const formatRating = (rating: number | undefined) => {
        if (!rating) return 0;
        return (rating / 100).toFixed(1);
    };

    // Truncate text if it's longer than 50 characters
    const truncateText = (text: string, maxLength: number = 120) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    const urlEquipment = `${import.meta.env.VITE_BACKEND_URL}uploads/products/thumbnails/${equipment?.thumbnail}`;

    return (
        <div className="bg-canvas rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
            <div className="relative h-56">
                <img
                    src={urlEquipment}
                    alt={equipment.thumbnail}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
                <div className="absolute top-4 right-4 bg-campfire text-white text-sm font-semibold py-1 px-3 rounded-full">
                    {formatPrice(equipment.price)}/day
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-semibold font-montserrat mb-2">{equipment.name}</h3>
                <p className="text-charcoal mb-4">{truncateText(equipment.description)}</p>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="text-sm text-gray-600">
                            <Star className="inline mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                            {formatRating(equipment.ratings.average)} ({equipment.ratings.count} reviews)
                        </span>
                    </div>
                    <Link to={`/rentals/${equipment._id}`}>
                        <Button className="bg-forest hover:bg-opacity-90 font-montserrat">Rent Now</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RentalCard;
