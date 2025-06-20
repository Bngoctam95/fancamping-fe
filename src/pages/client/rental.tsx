import RentalCard from 'components/rental/card';
import { getProductsAPI } from 'services/api';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import RentalFilters from 'components/rental/filters';

const RentalPage = () => {
    const { t } = useTranslation();
    const [allEquipment, setAllEquipment] = useState<IProductTable[]>([]);
    const [isLoadingEquipment, setIsLoadingEquipment] = useState<boolean>(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
    const [searchValue, setSearchValue] = useState<string>('');

    const fetchAllEquipment = async () => {
        const query = 'page=1&limit=100';
        const res = await getProductsAPI(query);
        if (res.data && res.data.items) {
            setAllEquipment(res.data.items);
            setIsLoadingEquipment(false);
        } else {
            setAllEquipment([]);
            setIsLoadingEquipment(false);
        }
    };

    useEffect(() => {
        fetchAllEquipment();
    }, []);

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
    };

    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    //Filter equipment
    const filteredEquipment = useMemo(() => {
        let result = [...allEquipment];

        // Filter by category
        if (selectedCategoryId !== 'all') {
            result = result.filter((item) => item.categoryId._id === selectedCategoryId);
        }

        // Filter by search
        if (searchValue) {
            const searchLower = searchValue.toLowerCase();
            result = result.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchLower) ||
                    item.description?.toLowerCase().includes(searchLower)
            );
        }
        return result;
    }, [allEquipment, selectedCategoryId, searchValue]);

    return (
        <>
            <Helmet>
                <title>
                    {t('siteName')} | {t('header.rentals')}
                </title>
                <meta name="description" content={t('rental.hero.subtitle')} />
                <meta property="og:title" content={`${t('siteName')} | ${t('header.rentals')}`} />
                <meta property="og:description" content={t('rental.hero.subtitle')} />
                <meta property="og:type" content="website" />
            </Helmet>
            <div className="py-12 bg-white">
                <div className="container mx-auto px-6">
                    <RentalFilters
                        onCategoryChange={handleCategoryChange}
                        onSearch={handleSearch}
                        searchValue={searchValue}
                    />
                </div>
                <div className="container mx-auto px-6">
                    {isLoadingEquipment ? (
                        <div className="flex justify-center items-center min-h-[400px]">
                            <Loader2 className="h-12 w-12 animate-spin text-forest" />
                        </div>
                    ) : filteredEquipment.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEquipment.map((item) => (
                                <RentalCard key={item._id} equipment={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <h3 className="text-xl font-semibold font-montserrat mb-2">No equipment found</h3>
                            <p className="text-gray-600">Try adjusting your filters or search terms</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default RentalPage;
