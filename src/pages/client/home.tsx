import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
    const { t } = useTranslation();
    return (
        <>
            <Helmet>
                <title>{t('siteName')} | {t('header.home')}</title>
                <meta name="description" content={t('home.hero.subtitle')} />
                <meta property="og:title" content={`${t('siteName')} | ${t('header.home')}`} />
                <meta property="og:description" content={t('home.hero.subtitle')} />
                <meta property="og:type" content="website" />
            </Helmet>
            <div>
                <h1>Home</h1>
            </div>
        </>
    )
}

export default HomePage;

