import { Menu, Tent, User, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSwitcher from 'components/ui/language.switcher';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { useCurrentApp } from 'hooks/useCurrentApp';
import { logoutAPI } from 'services/api';

const AppHeader = () => {
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated, setUser, setIsAuthenticated } = useCurrentApp();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const userDropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.data) {
            setUser(null);
            setIsAuthenticated(false);
        }
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-primary shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/">
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <Tent className="text-secondary text-2xl" />
                            <span className="font-montserrat font-bold text-2xl text-white">{t('siteName')}</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8 items-center">
                        <Link
                            to="/"
                            className="font-montserrat text-lg font-medium text-white hover:text-secondary transition-colors"
                        >
                            {t('header.home')}
                        </Link>

                        <Link
                            to="/rental"
                            className="font-montserrat text-lg font-medium text-white hover:text-secondary transition-colors"
                        >
                            {t('header.rentals')}
                        </Link>

                        <Link
                            to="/blog"
                            className="font-montserrat text-lg font-medium text-white hover:text-secondary transition-colors"
                        >
                            {t('header.blogs')}
                        </Link>

                        <Link
                            to="/article"
                            className="font-montserrat text-lg font-medium text-white hover:text-secondary transition-colors"
                        >
                            {t('header.articles')}
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-4">
                        {/* Language Switcher - Desktop */}
                        <div className="hidden md:block">
                            <LanguageSwitcher />
                        </div>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative inline-block" ref={userDropdownRef}>
                                <button
                                    onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                                    className="flex items-center gap-2 bg-dropdown border border-gray-700 rounded p-2 text-white hover:border-blue-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer duration-200"
                                >
                                    <User className="h-6 w-6 text-white" />
                                    <svg
                                        className={`fill-current h-4 w-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </button>
                                {isUserDropdownOpen && (
                                    <div className="absolute right-0 mt-2 min-w-[200px] rounded-md bg-dropdown border border-gray-700 shadow-lg animate-fadeIn z-50">
                                        <div className="py-1 px-1">
                                            <div className="flex items-center px-3 py-2 text-white text-base font-semibold">
                                                {user?.avatar ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_BACKEND_URL}uploads/users/${user?.avatar}`}
                                                        alt="profile"
                                                        className="h-10 w-10 mr-2 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="h-4 w-4 mr-2" />
                                                )}
                                                <span>{user?.name || 'User'}</span>
                                            </div>
                                            <div className="my-1 border-t border-gray-700" />
                                            {user?.role === 'admin' ||
                                            user?.role === 'super_admin' ||
                                            user?.role === 'mod' ? (
                                                <>
                                                    <Link
                                                        to="/admin"
                                                        className="flex items-center px-3 py-2 text-white text-base hover:bg-gray-700 rounded transition-colors duration-150"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                    >
                                                        {t('header.admin')}
                                                    </Link>
                                                    <Link
                                                        to="/my-articles"
                                                        className="flex items-center px-3 py-2 text-white text-base hover:bg-gray-700 rounded transition-colors duration-150"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                    >
                                                        {t('header.myArticles')}
                                                    </Link>
                                                </>
                                            ) : (
                                                <Link
                                                    to="/my-blog"
                                                    className="flex items-center px-3 py-2 text-white text-base hover:bg-gray-700 rounded transition-colors duration-150"
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    {t('header.myBlog')}
                                                </Link>
                                            )}
                                            <Link
                                                to="/profile"
                                                className="flex items-center px-3 py-2 text-white text-base hover:bg-gray-700 rounded transition-colors duration-150"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                            >
                                                {t('header.profile')}
                                            </Link>
                                            <Link
                                                to="/my-rentals"
                                                className="flex items-center px-3 py-2 text-white text-base hover:bg-gray-700 rounded transition-colors duration-150"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                            >
                                                {t('header.myRentals')}
                                            </Link>

                                            <div className="my-1 border-t border-gray-700" />
                                            <button
                                                onClick={() => {
                                                    setIsUserDropdownOpen(false);
                                                    handleLogout();
                                                }}
                                                className="flex items-center w-full px-3 py-2 text-white text-base hover:bg-gray-700 rounded transition-colors duration-150"
                                            >
                                                <svg
                                                    className="h-4 w-4 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                                                    />
                                                </svg>
                                                {t('header.signOut')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="font-montserrat font-medium text-white text-base hover:text-secondary transition-colors"
                            >
                                {t('header.login')}
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-white text-xl focus:outline-none"
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
                        <Link to="/" className="block py-2 text-white text-base hover:text-secondary transition-colors">
                            {t('header.home')}
                        </Link>

                        <Link
                            to="/rental"
                            className="block py-2 text-white text-base hover:text-secondary transition-colors"
                        >
                            {t('header.rentals')}
                        </Link>

                        <Link
                            to="/blog"
                            className="block py-2 text-white text-base hover:text-secondary transition-colors"
                        >
                            {t('header.blogs')}
                        </Link>

                        <Link
                            to="/article"
                            className="block py-2 text-white text-base hover:text-secondary transition-colors"
                        >
                            {t('header.articles')}
                        </Link>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <LanguageSwitcher />

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/profile"
                                        className="block py-2 text-white text-base hover:text-secondary transition-colors"
                                    >
                                        {t('header.profile')}
                                    </Link>
                                    <Link
                                        to="/my-rentals"
                                        className="block py-2 text-white text-base hover:text-secondary transition-colors"
                                    >
                                        {t('header.myRentals')}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left py-2 text-white text-base hover:text-secondary transition-colors"
                                    >
                                        {t('header.signOut')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block py-2 text-white text-base hover:text-secondary transition-colors"
                                    >
                                        {t('header.login')}
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block py-2 text-white text-base hover:text-secondary transition-colors"
                                    >
                                        {t('header.register')}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default AppHeader;
