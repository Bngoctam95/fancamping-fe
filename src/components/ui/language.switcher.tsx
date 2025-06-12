import { useState, useEffect, useRef } from 'react';
import i18n from '@/i18n';

const LanguageSwitcher = () => {
    const [language, setLanguage] = useState(i18n.language || 'en');
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredLang, setHoveredLang] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLanguage(i18n.language);
    }, [i18n.language]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage);
        i18n.changeLanguage(newLanguage);
        setIsOpen(false);
        setHoveredLang(null);
    };

    const getActiveLanguage = (lang: string) => {
        if (hoveredLang) {
            return hoveredLang === lang;
        }
        return language === lang;
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-dropdown border border-gray-700 rounded py-2 px-3 text-white text-base hover:border-blue-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer duration-200"
            >
                <span>{language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                <svg
                    className={`fill-current h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute mt-1 min-w-[130px] rounded-md bg-dropdown border border-gray-700 shadow-lg animate-fadeIn">
                    <div className="py-1 px-1">
                        <button
                            onClick={() => handleLanguageChange('vi')}
                            onMouseEnter={() => setHoveredLang('vi')}
                            onMouseLeave={() => setHoveredLang(null)}
                            className={`flex items-center justify-between w-full px-2 py-2 text-base text-white rounded hover:bg-gray-700 transition-colors duration-150 ${getActiveLanguage('vi') ? 'bg-gray-700' : ''}`}
                        >
                            <span className="flex-1 text-left">Tiếng Việt</span>
                            <div className="flex-shrink-0 ml-4">
                                {getActiveLanguage('vi') && (
                                    <svg
                                        className="h-4 w-4 text-blue-500"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M5 13l4 4L19 7"></path>
                                    </svg>
                                )}
                            </div>
                        </button>
                        <button
                            onClick={() => handleLanguageChange('en')}
                            onMouseEnter={() => setHoveredLang('en')}
                            onMouseLeave={() => setHoveredLang(null)}
                            className={`flex items-center justify-between w-full px-2 py-2 text-base text-white rounded hover:bg-gray-700 transition-colors duration-150 ${getActiveLanguage('en') ? 'bg-gray-700' : ''}`}
                        >
                            <span className="flex-1 text-left">English</span>
                            <div className="flex-shrink-0 ml-8">
                                {getActiveLanguage('en') && (
                                    <svg
                                        className="h-4 w-4 text-blue-500"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M5 13l4 4L19 7"></path>
                                    </svg>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
