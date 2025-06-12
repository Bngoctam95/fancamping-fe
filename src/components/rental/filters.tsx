import { Search, X } from 'lucide-react';
import DropdownDefault from '../ui/dropdown';
import { useEffect, useState, useRef, useCallback } from 'react';
import { App } from 'antd';
import { getEquipmentCategoriesAPI } from 'services/api';
import { useTranslation } from 'react-i18next';

interface DropdownOption {
    _id: string;
    text: string;
}

interface RentalFiltersProps {
    onCategoryChange?: (categoryId: string) => void;
    onSearch?: (searchValue: string) => void;
    searchValue?: string;
}

const SearchInput = ({ onSearch, searchValue = '' }: { onSearch: (value: string) => void; searchValue?: string }) => {
    const [localSearchValue, setLocalSearchValue] = useState<string>(searchValue);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimerRef = useRef<number>();
    const { t } = useTranslation();

    // Update local state when prop changes
    useEffect(() => {
        setLocalSearchValue(searchValue);
    }, [searchValue]);

    const debouncedSearch = useCallback(
        (value: string) => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            debounceTimerRef.current = setTimeout(() => {
                onSearch(value);
            }, 3000); // 3 seconds delay
        },
        [onSearch]
    );

    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            onSearch(localSearchValue);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalSearchValue(newValue);
        debouncedSearch(newValue);
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    return (
        <div className="relative w-full md:w-auto">
            <input
                ref={inputRef}
                type="text"
                placeholder={t('equipment.featured.search')}
                value={localSearchValue}
                onChange={handleInputChange}
                onKeyPress={handleSearchKeyPress}
                className="bg-[#e6e2db] pl-10 pr-4 py-2 w-full md:w-auto rounded-md text-gray-700 text-base"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

            {localSearchValue && (
                <button
                    onClick={() => {
                        setLocalSearchValue('');
                        onSearch?.('');
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

const RentalFilters = ({ onCategoryChange, onSearch, searchValue }: RentalFiltersProps) => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<IEquipmentCategory[]>([]);
    const [category, setCategory] = useState<string>(t('equipment.featured.allCategories'));
    const [sort, setSort] = useState<string>(t('equipment.featured.default'));
    const { message } = App.useApp();

    useEffect(() => {
        const fetchAllCategories = async () => {
            const res = await getEquipmentCategoriesAPI();
            if (res?.data) {
                const categories = res.data as unknown as IEquipmentCategory[];
                setCategories(categories);
            } else {
                message.error(res?.message || 'Lỗi khi tải danh mục');
            }
        };

        fetchAllCategories();
    }, []);

    const handleCategorySelect = (option: DropdownOption) => {
        setCategory(option.text);
        onCategoryChange?.(option._id);
    };

    const handleSortSelect = (option: DropdownOption) => {
        setSort(option.text);
    };

    // Desktop filters
    const DesktopFilters = () => (
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold font-montserrat text-forest mb-4 md:mb-0">
                {t('equipment.featured.rentals')}
            </h2>
            <div className="flex flex-wrap items-center gap-4">
                <SearchInput onSearch={onSearch || (() => {})} searchValue={searchValue} />
                <DropdownDefault
                    options={[
                        { _id: 'all', text: t('equipment.featured.allCategories') },
                        ...categories.map((category) => ({
                            _id: category._id,
                            text: category.name,
                        })),
                    ]}
                    onSelect={handleCategorySelect}
                    value={category}
                    className="w-[200px]"
                />
                <DropdownDefault
                    options={[
                        { _id: 'default', text: t('equipment.featured.default') },
                        { _id: 'price_low_high', text: t('equipment.featured.priceLowHigh') },
                        { _id: 'price_high_low', text: t('equipment.featured.priceHighLow') },
                        { _id: 'rating', text: t('equipment.featured.rating') },
                    ]}
                    onSelect={handleSortSelect}
                    value={sort}
                    className="w-[200px]"
                />
            </div>
        </div>
    );
    return (
        <div>
            <DesktopFilters />
        </div>
    );
};

export default RentalFilters;
