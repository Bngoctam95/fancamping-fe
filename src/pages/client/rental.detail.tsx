import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { getProductDetailAPI } from '@/services/api';
import { ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, Loader2, Minus, Package, Plus, Star } from 'lucide-react';
import { DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import DropdownDefault from 'components/ui/dropdown';
import { useCurrentApp } from 'hooks/useCurrentApp';

interface DropdownOption {
    _id: string;
    text: string;
}

const RentalDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { t } = useTranslation();
    const { isAuthenticated } = useCurrentApp();
    const { RangePicker } = DatePicker;
    const [productDetail, setProductDetail] = useState<IProductTable | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const [selectedAddons, setSelectedAddons] = useState<string>('Bảo vệ thiệt hại (+200.000đ/ngày)');
    const [rentalQuantity, setRentalQuantity] = useState(0);

    const urlThumbnail = `${import.meta.env.VITE_BACKEND_URL}uploads/products/thumbnails/${productDetail?.thumbnail}`;

    const productImages = productDetail
        ? [
              urlThumbnail, // Always include thumbnail as first image
              ...(productDetail.slider && productDetail.slider.length > 0
                  ? productDetail.slider.map(
                        (sliderItem) => `${import.meta.env.VITE_BACKEND_URL}uploads/products/slider/${sliderItem}`
                    )
                  : []),
          ]
        : [];

    useEffect(() => {
        const fetchProductDetail = async () => {
            const res = await getProductDetailAPI(id as string);
            if (res.data) {
                setProductDetail(res.data);
                setIsLoading(false);
            }
        };
        fetchProductDetail();
    }, [id]);

    const formatPrice = (price: number) => {
        return `${price.toLocaleString('vi-VN')} VND`;
    };

    const handleAddonSelect = (option: DropdownOption) => {
        setSelectedAddons(option.text);
    };

    const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null, dateStrings: [string, string]) => {
        if (dates) {
            setDateRange(dates);
        } else {
            setDateRange([null, null]);
        }
    };

    const incrementQuantity = () => {
        if (!productDetail) return;

        setRentalQuantity((prev) => (prev < productDetail.inventory.available ? prev + 1 : prev));
    };

    const decrementQuantity = () => {
        setRentalQuantity((prev) => Math.max(prev - 1, 0));
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    };

    const goToImage = (index: number) => {
        setCurrentImageIndex(index);
    };

    // Auto-play functionality (optional)
    useEffect(() => {
        if (productImages.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
            }, 5000); // Auto-advance every 5 seconds

            return () => clearInterval(interval);
        }
    }, [productImages.length]);

    const handleRentNow = () => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            console.log('Rent now');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-12 w-12 animate-spin text-forest" />
            </div>
        );
    }

    if (!productDetail) {
        return (
            <div className="container mx-auto px-6 py-16">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">{t('equipment.detail.equipmentNotFound')}</h2>
                    <Link to="/rental" className="flex items-center justify-center">
                        <button className="bg-primary flex items-center justify-center hover:bg-primary-hover font-montserrat text-white font-semibold text-sm px-4 py-3 rounded-md">
                            <ArrowLeft className="mr-2 h-4 w-4" /> {t('equipment.detail.backToRentals')}
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

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
            <div className="bg-canvas py-6">
                <div className="container mx-auto px-6">
                    <Link to="/rental">
                        <button className="bg-button flex items-center justify-center hover:bg-button-hover font-montserrat text-white font-semibold text-sm px-4 py-3 mb-6 rounded-md">
                            <ArrowLeft className="mr-2 h-4 w-4" /> {t('equipment.detail.backToRentals')}
                        </button>
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Equipment Image */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg overflow-hidden shadow-md">
                                {/* Main Image with Navigation */}
                                <div className="relative overflow-hidden">
                                    <div
                                        className="flex transition-transform duration-500 ease-in-out"
                                        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                                    >
                                        {productImages.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`${productDetail.name} - Image ${index + 1}`}
                                                className="w-full h-[400px] object-cover flex-shrink-0"
                                            />
                                        ))}
                                    </div>

                                    {/* Navigation Arrows */}
                                    {productImages.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 z-10"
                                                aria-label="Previous image"
                                            >
                                                <ChevronLeft className="h-6 w-6" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 z-10"
                                                aria-label="Next image"
                                            >
                                                <ChevronRight className="h-6 w-6" />
                                            </button>
                                        </>
                                    )}

                                    {/* Image Counter */}
                                    {productImages.length > 1 && (
                                        <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                            {currentImageIndex + 1} / {productImages.length}
                                        </div>
                                    )}

                                    {/* Dot Indicators */}
                                    {productImages.length > 1 && (
                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                            {productImages.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => goToImage(index)}
                                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                        index === currentImageIndex
                                                            ? 'bg-white scale-125'
                                                            : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                                                    }`}
                                                    aria-label={`Go to image ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail Slider */}
                                {productImages.length > 1 && (
                                    <div className="p-4 bg-gray-100">
                                        <div className="flex space-x-2 overflow-x-auto pb-2">
                                            {productImages.map((image, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => goToImage(index)}
                                                    className={`flex-shrink-0 w-36 aspect-[16/9] rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                                        index === currentImageIndex
                                                            ? 'border-forest shadow-md'
                                                            : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`${productDetail.name} thumbnail ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                        <div>
                                            <h1 className="text-3xl font-bold font-montserrat text-forest mb-2">
                                                {productDetail.name}
                                            </h1>

                                            <p className="text-sm mb-2 inline-block bg-neutral-200 rounded-full px-2 py-1">
                                                Category: {productDetail.categoryId.name}
                                            </p>

                                            <div className="flex items-center">
                                                <Star className="fill-yellow-500 text-yellow-500 h-5 w-5 mr-1" />
                                                <span className="font-semibold mr-1">
                                                    {productDetail.ratings.average}
                                                </span>
                                                <span className="text-gray-600">
                                                    ({productDetail.ratings.count} {t('equipment.detail.reviews')})
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-campfire text-white text-xl font-semibold py-2 px-4 rounded-full">
                                            {formatPrice(productDetail.price)}/{t('equipment.detail.day')}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-6 mt-6">
                                        <h2 className="text-xl font-semibold font-montserrat mb-4">
                                            {t('equipment.detail.description')}
                                        </h2>
                                        <p className="text-gray-700">{productDetail.description}</p>
                                    </div>

                                    <div className="border-t border-gray-200 pt-6 mt-6">
                                        <h2 className="text-xl font-semibold font-montserrat mb-4">
                                            {t('equipment.detail.features')}
                                        </h2>
                                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                                            <li>Premium quality materials</li>
                                            <li>Easy setup and takedown</li>
                                            <li>Lightweight and portable</li>
                                            <li>Includes carrying case</li>
                                            <li>Weather resistant</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rental Form */}
                        <div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold font-montserrat mb-2">
                                            {t('equipment.detail.rentThisEquipment')}
                                        </h2>
                                        <p className="text-gray-500">
                                            {t('equipment.detail.selectRentalDatesAndOptions')}
                                        </p>
                                    </div>
                                    {productDetail.inventory.available > 0 ? (
                                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                            <span className="font-semibold">Hàng có sẵn</span>
                                        </div>
                                    ) : (
                                        <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                            <span className="font-semibold">Hết hàng</span>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            {t('equipment.detail.selectDateRange')}
                                        </label>
                                        <RangePicker className="w-full" onChange={handleDateRangeChange} />
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                            <Package className="h-4 w-4" />
                                            <span className="font-semibold">Tổng:</span> {productDetail.inventory.total}
                                        </div>
                                        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="font-semibold">Có sẵn:</span>{' '}
                                            {productDetail.inventory.available - rentalQuantity}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            {t('equipment.detail.quantity')}
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                className={`${rentalQuantity <= 0 ? 'bg-gray-100 text-gray-500' : 'bg-gray-200 text-gray-500 hover:bg-button-hover hover:text-white'} font-montserrat font-semibold text-sm px-4 py-3 rounded-md`}
                                                onClick={decrementQuantity}
                                                disabled={rentalQuantity <= 0}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-8 text-center font-medium">{rentalQuantity}</span>
                                            <button
                                                className={`${rentalQuantity >= productDetail.inventory.available ? 'bg-gray-100 text-gray-500' : 'bg-gray-200 text-gray-500 hover:bg-button-hover hover:text-white'} font-montserrat font-semibold text-sm px-4 py-3 rounded-md`}
                                                onClick={incrementQuantity}
                                                disabled={rentalQuantity >= productDetail.inventory.available}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                            <span className="ml-2">{t('equipment.detail.items')}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            {t('equipment.detail.additionalOptions')}
                                        </label>
                                        <DropdownDefault
                                            options={[
                                                { _id: 'damage-protection', text: 'Bảo vệ thiệt hại (+200.000đ/ngày)' },
                                                { _id: 'cleaning-service', text: 'Dọn dẹp (+100.000đ)' },
                                                {
                                                    _id: 'delivery-to-location',
                                                    text: 'Giao hàng đến địa điểm (+200.000đ)',
                                                },
                                            ]}
                                            onSelect={handleAddonSelect}
                                            value={selectedAddons}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="pt-4 pb-4 border-t">
                                        <div className="flex justify-between mb-2">
                                            <span>{t('equipment.detail.baseRate')}</span>
                                            <span>
                                                {formatPrice(productDetail.price)} ×{' '}
                                                {dateRange[0] && dateRange[1]
                                                    ? dateRange[1].diff(dateRange[0], 'day') + 1
                                                    : 0}{' '}
                                                {t('equipment.detail.days')} × {rentalQuantity}{' '}
                                                {t('equipment.detail.items')}{' '}
                                            </span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span>{t('equipment.detail.addOns')}</span>
                                            <span>{formatPrice(0)}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                                            <span>{t('equipment.detail.total')}</span>
                                            <span>
                                                {formatPrice(
                                                    productDetail.price *
                                                        (dateRange[0] && dateRange[1]
                                                            ? dateRange[1].diff(dateRange[0], 'day') + 1
                                                            : 0) *
                                                        rentalQuantity
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className="w-full bg-button hover:bg-button-hover font-montserrat text-base font-semibold text-white px-4 py-3 rounded-md"
                                        onClick={handleRentNow}
                                    >
                                        {t('equipment.detail.rentNow')}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold font-montserrat mb-4">
                                    {t('equipment.detail.rentalPolicies')}
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">•</span>
                                        <span>{t('equipment.detail.depositRequired')}</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">•</span>
                                        <span>{t('equipment.detail.idVerificationRequired')}</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">•</span>
                                        <span>{t('equipment.detail.equipmentMustBeReturned')}</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">•</span>
                                        <span>{t('equipment.detail.cancellationUpTo48Hours')}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RentalDetailPage;
