import { Menu, Tent, User, X } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "components/ui/language.switcher";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const AppHeader = () => {
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        console.log("logout");
    };

    return (
        <header className="bg-primary shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/">
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <Tent className="text-primary text-2xl" />
                            <span className="font-montserrat font-bold text-xl text-white">
                                {t('siteName')}
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

                        {/* User Menu */}
                        {user ? (
                            <User className="h-5 w-5" />
                        ) : (
                            <Link to="/login" className="font-montserrat font-medium text-white hover:text-primary transition-colors">
                                {t("header.login")}
                            </Link>
                        )}

                        

                        {/* Mobile Menu Button */}
                        <button 
                            className="md:hidden text-foreground text-xl focus:outline-none"
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                        {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4">
                        <Link to="/" className="block py-2 text-foreground hover:text-primary transition-colors">
                            {t('header.home')}
                        </Link>

                        <Link to="/rental" className="block py-2 text-foreground hover:text-primary transition-colors">
                            {t("header.rentals")}
                        </Link>

                        <Link to="/blog" className="block py-2 text-foreground hover:text-primary transition-colors">
                            {t("header.blogs")}
                        </Link>

                        <Link to="/article" className="block py-2 text-foreground hover:text-primary transition-colors">
                            {t("header.articles")}
                        </Link>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <LanguageSwitcher />
                            
                            {user ? (
                                <>
                                <Link to="/profile" className="block py-2 text-foreground hover:text-primary transition-colors">
                                    Profile
                                </Link>
                                <Link to="/my-rentals" className="block py-2 text-foreground hover:text-primary transition-colors">
                                    My Rentals
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
                                >
                                    Logout
                                </button>
                                </>
                            ) : (
                                <>
                                <Link to="/login" className="block py-2 text-foreground hover:text-primary transition-colors">
                                    {t('header.login')}
                                </Link>
                                <Link to="/register" className="block py-2 text-foreground hover:text-primary transition-colors">
                                    Register
                                </Link>
                                </>
                            )}
                        </div>
                    </div>
                    )}
            </div>
        </header>
    )
}

export default AppHeader;

