import { getProductsAPI } from 'services/api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RentalCard from 'components/rental/card';
import { useTranslation } from 'react-i18next';

const FeaturedEquipment = () => {
    const [isLoadingEquipment, setIsLoadingEquipment] = useState<boolean>(true);
    const [filteredEquipment, setFilteredEquipment] = useState<IProductTable[]>([]);
    const { t } = useTranslation();

    const fetchEquipment = async () => {
        const query = 'page=1&limit=6';
        const res = await getProductsAPI(query);
        console.log('Featured Equipment:', res.data);
        if (res.data && res.data.items) {
            setFilteredEquipment(res.data.items);
            setIsLoadingEquipment(false);
        } else {
            setFilteredEquipment([]);
            setIsLoadingEquipment(false);
        }
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    return (
        <section className="py-16">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="font-montserrat font-bold text-primary text-3xl mb-2">
                            {t('equipment.featured.title')}
                        </h2>
                        <p className="font-opensans text-primary text-base">{t('equipment.featured.subtitle')}</p>
                    </div>
                </div>

                {isLoadingEquipment ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="bg-canvas rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 animate-pulse"
                            >
                                <div className="h-56 bg-gray-300"></div>
                                <div className="p-6">
                                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                                    <div className="flex justify-between items-center">
                                        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                                        <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredEquipment.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEquipment.map((item) => (
                            <RentalCard key={item._id} equipment={item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-lg text-gray-600">{t('equipment.featured.noEquipment')}</p>
                    </div>
                )}

                <div className="sm:col-span-2 lg:col-span-3 text-center mt-8">
                    <Link
                        to="/rental"
                        className="inline-flex items-center text-forest hover:text-campfire font-semibold font-montserrat"
                    >
                        <button className="bg-primary hover:bg-primary-hover font-montserrat text-white font-semibold text-sm px-4 py-3 rounded-md">
                            {t('equipment.featured.viewAll')} <span className="ml-2">→</span>
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedEquipment;
