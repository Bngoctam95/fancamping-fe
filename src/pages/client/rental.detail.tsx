import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { getProductDetailAPI } from '@/services/api';
import { ArrowLeft, Loader2, Minus, Plus, Star } from 'lucide-react';

const RentalDetailPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const [productDetail, setProductDetail] = useState<IProductTable | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const urlThumbnail = `${import.meta.env.VITE_BACKEND_URL}uploads/products/thumbnails/${productDetail?.thumbnail}`;

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

    // Format price from cents to dollars
    const formatPrice = (cents: number) => {
        return `$${(cents / 100).toFixed(2)}`;
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
                    <h2 className="text-2xl font-bold mb-4">Equipment not found</h2>
                    <Link to="/rental" className="flex items-center justify-center">
                        <button className="bg-primary flex items-center justify-center hover:bg-primary-hover font-montserrat text-white font-semibold text-sm px-4 py-3 rounded-md">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Rentals
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
            <div className="bg-canvas py-12">
                <div className="container mx-auto px-6">
                    <Link to="/rental">
                        <button className="bg-button flex items-center justify-center hover:bg-button-hover font-montserrat text-white font-semibold text-sm px-4 py-3 mb-6 rounded-md">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Rentals
                        </button>
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Equipment Image */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg overflow-hidden shadow-md">
                                <img
                                    src={urlThumbnail}
                                    alt={productDetail.name}
                                    className="w-full h-[400px] object-cover"
                                />
                                <div className="p-6">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                        <div>
                                            <h1 className="text-3xl font-bold font-montserrat text-forest mb-2">
                                                {productDetail.name}
                                            </h1>
                                            <p className="text-sm text-gray-600 mb-2">
                                                Category: {productDetail.categoryId.name}
                                            </p>
                                            <div className="flex items-center">
                                                <Star className="fill-yellow-500 text-yellow-500 h-5 w-5 mr-1" />
                                                <span className="font-semibold mr-1">
                                                    {productDetail.ratings.average}
                                                </span>
                                                <span className="text-gray-600">
                                                    ({productDetail.ratings.count} reviews)
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-campfire text-white text-xl font-semibold py-2 px-4 rounded-full">
                                            {formatPrice(productDetail.price)}/day
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-6 mt-6">
                                        <h2 className="text-xl font-semibold font-montserrat mb-4">Description</h2>
                                        <p className="text-gray-700">{productDetail.description}</p>
                                    </div>

                                    <div className="border-t border-gray-200 pt-6 mt-6">
                                        <h2 className="text-xl font-semibold font-montserrat mb-4">Features</h2>
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
                            <div>
                                <h2 className="text-xl font-semibold font-montserrat mb-4">Rent This Equipment</h2>
                                <p className="text-gray-700">Select rental dates and options</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Start Date</label>
                                    <div className="flex items-center">
                                        <input
                                            type="date"
                                            className="w-full rounded-md border border-gray-300 p-2"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Rental Duration</label>
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => {}} disabled={false}>
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-8 text-center font-medium">1</span>
                                        <button onClick={() => {}} disabled={false}>
                                            <Plus className="h-4 w-4" />
                                        </button>
                                        <span className="ml-2">days</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex justify-between mb-2">
                                        <span>Base Rate</span>
                                        <span>
                                            {formatPrice(productDetail.price)} × {1} days
                                        </span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Add-ons</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                                        <span>Total</span>
                                        <span>{formatPrice(productDetail.price * 1)}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button
                                    className="w-full bg-forest hover:bg-opacity-90 font-montserrat text-lg"
                                    onClick={() => {}}
                                >
                                    Rent Now
                                </button>
                            </div>

                            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold font-montserrat mb-4">Rental Policies</h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">•</span>
                                        <span>Deposit required (refundable)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">•</span>
                                        <span>ID verification required at pickup</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">•</span>
                                        <span>Equipment must be returned in original condition</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-semibold mr-2">•</span>
                                        <span>Cancellation up to 48 hours before for full refund</span>
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
