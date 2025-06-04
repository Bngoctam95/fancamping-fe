import { loginAPI } from 'services/api';
import { Tent, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validate both fields
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);

        setErrors({
            email: emailError,
            password: passwordError,
        });

        // If no errors, proceed with login
        if (!emailError && !passwordError) {
            // Handle login logic here
            console.log('Form submitted:', formData);
            const res = await loginAPI(formData.email, formData.password);
            console.log(res.data);
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
                <Tent className="text-primary text-4xl" />
                <span className="font-montserrat font-bold text-3xl text-white">
                    Fancamping
                </span>
            </div>
            <div className="bg-[#27272a] shadow-md rounded-lg px-8 py-6 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-4 text-white">Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`shadow-sm rounded-md w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-[#27272a] text-white`}
                            placeholder="demo@campviet.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`shadow-sm rounded-md w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-[#27272a] text-white pr-10`}
                                placeholder="Enter your password"
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

                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#9BD5E8] hover:bg-[#88C1D4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9BD5E8]"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6 flex flex-col items-center gap-2 text-sm">
                    <a href="/register" className="text-primary hover:text-primary/80 transition-colors">
                        Create Account
                    </a>
                    <a href="/" className="text-gray-400 hover:text-gray-300 transition-colors">
                        Back to Home Page
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

