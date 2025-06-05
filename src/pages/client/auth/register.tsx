import { Tent, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { message, notification } from 'antd';
import { registerAPI } from 'services/api';

const RegisterPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateName = (name: string) => {
        if (!name) {
            return 'Name is required';
        }
        if (name.length < 2) {
            return 'Name must be at least 2 characters long';
        }
        return '';
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return 'Email is required';
        }
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const validatePassword = (password: string) => {
        if (!password) {
            return 'Password is required';
        }
        if (password.length < 6) {
            return 'Password must be at least 6 characters long';
        }
        return '';
    };

    const validateConfirmPassword = (password: string, confirmPassword: string) => {
        if (!confirmPassword) {
            return 'Please confirm your password';
        }
        if (password !== confirmPassword) {
            return 'Passwords do not match';
        }
        return '';
    };

    const validatePhone = (phone: string) => {
        if (!phone) {
            return 'Phone number is required';
        }
        if (!/^\d+$/.test(phone)) {
            return 'Phone number must contain only numbers';
        }
        return '';
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);
        const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
        const phoneError = validatePhone(formData.phone);

        setErrors({
            name: nameError,
            email: emailError,
            password: passwordError,
            confirmPassword: confirmPasswordError,
            phone: phoneError,
        });

        // If no errors, proceed with registration
        if (!nameError && !emailError && !passwordError && !confirmPasswordError && !phoneError) {
            setIsLoading(true);
            const res = await registerAPI(formData.name, formData.email, formData.password, formData.phone);
            if (res?.data) {
                //success
                console.log(res);
                const messageKey = String(res.message_key) as "register.success";
                message.success(t(messageKey));
                navigate('/login');
            } else {
                //error
                const messageKey = String(res.message_key) as "register.errorMessage";
                notification.error({
                    message: t("register.errorLabel"),
                    description: t(messageKey),
                    duration: 5
                })
            }
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center w-full bg-[#0f172a]">
            <div className="flex items-center gap-2 mb-8">
                <Tent className="text-secondary text-4xl" />
                <span className="font-montserrat font-bold text-3xl text-white">
                    {t('siteName')}
                </span>
            </div>
            <div className="bg-[#27272a] shadow-md rounded-lg px-8 py-6 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-4 text-white">{t("register.registerText")}</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                            {t("register.nameText")}
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`shadow-sm rounded-md w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-[#27272a] text-white`}
                            placeholder={t("register.namePlaceHolderText")}
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                            {t("register.emailText")}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete='email'
                            value={formData.email}
                            onChange={handleChange}
                            className={`shadow-sm rounded-md w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-[#27272a] text-white`}
                            placeholder={t("register.emailPlaceHolderText")}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                            {t("register.passwordText")}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                autoComplete='new-password'
                                value={formData.password}
                                onChange={handleChange}
                                className={`shadow-sm rounded-md w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-[#27272a] text-white pr-10`}
                                placeholder={t("register.passwordPlaceHolderText")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                            {t("register.confirmPasswordText")}
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                autoComplete='new-password'
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`shadow-sm rounded-md w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-[#27272a] text-white pr-10`}
                                placeholder={t("register.confirmPasswordPlaceHolderText")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                            {t("register.phoneText")}
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`shadow-sm rounded-md w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-[#27272a] text-white`}
                            placeholder={t("register.phonePlaceHolderText")}
                        />
                        {errors.phone && (
                            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#9BD5E8] hover:bg-[#88C1D4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9BD5E8] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
                                    </path>
                                </svg>
                                {t("register.registerButtonText")}
                            </>
                        ) : (
                            t("register.registerButtonText")
                        )}
                    </button>
                </form>

                <div className="mt-6 flex flex-col items-center gap-2 text-sm">
                    <Link to="/login" className="text-secondary hover:text-secondary/80 transition-colors">{t("register.loginText")}</Link>
                    <Link to="/" className="text-gray-400 hover:text-gray-300 transition-colors">{t("register.backHomeText")}</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

