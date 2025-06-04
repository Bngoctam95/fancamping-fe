import { useState, useEffect } from "react";
import i18n from '@/i18n';

const LanguageSwitcher = () => {
    const [language, setLanguage] = useState(i18n.language || 'en');

    useEffect(() => {
        setLanguage(i18n.language);
    }, [i18n.language]);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);
        i18n.changeLanguage(newLanguage);
    };

    return (
        <div className="relative inline-block">
            <select
                value={language}
                onChange={handleLanguageChange}
                className="appearance-none bg-dropdown border border-gray-700 rounded py-2 px-2 pr-8 leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer duration-200 text-white"
            >
                <option value="vi" className="py-2">Tiếng Việt</option>
                <option value="en" className="py-2">English</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
