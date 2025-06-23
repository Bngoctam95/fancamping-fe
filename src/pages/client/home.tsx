import FeaturedEquipment from 'components/home/featured.equipment';
import HeroSection from 'components/home/hero.section';
import BlogSection from 'components/home/blog.section';
import ArticleSection from 'components/home/article.section';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import CallAction from 'components/home/call.action';

const HomePage = () => {
    const { t } = useTranslation();
    return (
        <>
            <Helmet>
                <title>
                    {t('siteName')} | {t('header.home')}
                </title>
                <meta name="description" content={t('home.hero.subtitle')} />
                <meta property="og:title" content={`${t('siteName')} | ${t('header.home')}`} />
                <meta property="og:description" content={t('home.hero.subtitle')} />
                <meta property="og:type" content="website" />
            </Helmet>
            <div>
                <HeroSection />
                <FeaturedEquipment />
                <BlogSection />
                <ArticleSection />
                <CallAction />
            </div>
        </>
    );
};

export default HomePage;
