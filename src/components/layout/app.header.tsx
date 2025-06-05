import { Tent } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "components/ui/language.switcher";
import { useTranslation } from "react-i18next";

const AppHeader = () => {
    const { t } = useTranslation();

    return (
        <header className="bg-primary shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/">
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <Tent className="text-primary text-2xl" />
                            <span className="font-montserrat font-bold text-xl text-white">
                                Fancamping
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8 items-center">
                        <Link to="/" className="font-montserrat font-medium text-white hover:text-primary transition-colors">
                            {t("header.home")}
                        </Link>

                        <Link to="/rental" className="font-montserrat font-medium text-white hover:text-primary transition-colors">
                            {t("header.rentals")}
                        </Link>

                        <Link to="/blog" className="font-montserrat font-medium text-white hover:text-primary transition-colors">
                            {t("header.blogs")}
                        </Link>

                        <Link to="/article" className="font-montserrat font-medium text-white hover:text-primary transition-colors">
                            {t("header.articles")}
                        </Link>

                    </nav>

                    <div className="flex items-center space-x-4">
                        {/* Language Switcher - Desktop */}
                        <div className="hidden md:block">
                            <LanguageSwitcher />
                        </div>

                        <Link to="/login" className="font-montserrat font-medium text-white hover:text-primary transition-colors">
                            {t("header.login")}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default AppHeader;

