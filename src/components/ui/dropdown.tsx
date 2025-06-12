import { useState, useEffect, useRef } from 'react';

interface DropdownOption {
    _id: string;
    text: string;
}

const DropdownDefault = ({
    options,
    onSelect,
    value,
    className,
}: {
    options: DropdownOption[];
    onSelect: (option: DropdownOption) => void;
    value: string;
    className?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);

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

    const handleClick = (option: DropdownOption) => {
        setIsOpen(!isOpen);
        onSelect(option);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const getActiveOption = (option: DropdownOption) => {
        if (hoveredOption) {
            return hoveredOption === option._id;
        } else {
            return value === option.text;
        }
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className={`flex items-center justify-between gap-2 bg-[#e6e2db] ${className} rounded py-2 px-3 text-gray-700 text-base cursor-pointer`}
            >
                <span>{value}</span>
                <svg
                    className={`fill-current h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </button>

            {isOpen && (
                <div
                    className={`absolute mt-1 ${className} rounded-md bg-white border border-gray-300 shadow-xl animate-fadeIn z-10 `}
                >
                    <div className="py-1 px-1">
                        {options.map((option) => (
                            <button
                                key={option._id}
                                onClick={() => handleClick(option)}
                                onMouseEnter={() => setHoveredOption(option._id)}
                                onMouseLeave={() => setHoveredOption(null)}
                                className={`flex items-center justify-between w-full px-2 py-2 text-base text-gray-700 rounded hover:bg-button hover:text-white transition-colors duration-150 ${getActiveOption(option) ? 'bg-button text-white' : ''}`}
                            >
                                <span className="flex-1 text-left">{option.text}</span>
                                <div className="flex-shrink-0 ml-4">
                                    {getActiveOption(option) && (
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
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownDefault;
