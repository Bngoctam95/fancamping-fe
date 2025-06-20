import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrentApp } from 'hooks/useCurrentApp';

const HeroSection = () => {
    const { t } = useTranslation();
    const { isAuthenticated } = useCurrentApp();

    return (
        <section className="relative">
            <div className="relative h-[500px] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
                    alt="Scenic camping location with tent by a lake"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 hero-overlay flex items-center justify-center">
                    <div className="text-center px-6">
                        <h1 className="text-4xl md:text-5xl font-bold font-montserrat text-white leading-tight mb-4">
                            {t('home.hero.title')}
                        </h1>
                        <p className="text-xl text-white mb-8 max-w-2xl mx-auto">{t('home.hero.subtitle')}</p>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                            <Link
                                to="/rental"
                                className="px-8 py-3 bg-campfire text-white font-semibold rounded-md hover:text-white hover:bg-campfire-hover transition duration-300 font-montserrat inline-block"
                            >
                                {t('home.hero.rentEquipment')}
                            </Link>
                            <Link
                                to={isAuthenticated ? '/blog' : '/login'}
                                className="px-8 py-3 bg-secondary text-white font-semibold rounded-md hover:text-white hover:bg-secondary-hover transition duration-300 font-montserrat inline-block"
                            >
                                {t('home.hero.joinCommunity')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
