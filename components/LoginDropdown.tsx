import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

interface LoginDropdownProps {
    onLoginSuccess?: () => void;
}

const LoginDropdown: React.FC<LoginDropdownProps> = ({ onLoginSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const dropdownRef = useRef<HTMLDivElement>(null);
    const mainAppUrl = process.env.REACT_APP_MAIN_APP_URL || 'https://www.daleelbalady.com';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!formData.email || !formData.password) {
            setError('Please enter both email and password');
            return;
        }

        if (!validateEmail(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            // Call the authentication API
            const response = await fetch('https://api.daleelbalady.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();

            // Backend returns 'token', but interface might expect 'accessToken'
            // Handle both cases
            const accessToken = data.accessToken || data.token;

            console.log('[LoginDropdown] Login response received:', {
                hasAccessToken: !!data.accessToken,
                hasToken: !!data.token,
                resolvedToken: !!accessToken,
                hasUser: !!data.user,
                user: data.user
            });

            // Store token and user data in localStorage
            // Use the same keys as the main app for consistency
            if (accessToken) {
                console.log('[LoginDropdown] Saving token to localStorage...');
                localStorage.setItem('daleel-token', accessToken);
                localStorage.setItem('authToken', accessToken); // Keep for compatibility
                console.log('[LoginDropdown] Token saved.');
            } else {
                console.error('[LoginDropdown] No access token found in response!');
            }

            if (data.user) {
                console.log('[LoginDropdown] Saving user data to localStorage...');
                localStorage.setItem('daleel-user', JSON.stringify(data.user));
                localStorage.setItem('user_data', JSON.stringify(data.user)); // Keep for compatibility
                console.log('[LoginDropdown] User data saved.');
            } else {
                console.error('[LoginDropdown] No user in response!');
            }

            // Close dropdown and notify parent
            setIsOpen(false);
            if (onLoginSuccess) {
                onLoginSuccess();
            }

            console.log('[LoginDropdown] Reloading page...');
            // Reload the page to reflect authenticated state
            window.location.reload();
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (error) {
            setError(null);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Login Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-4 py-2"
            >
                Login
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 z-50">
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            Quick Login
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-10 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">
                                    Or
                                </span>
                            </div>
                        </div>

                        {/* More Options Link */}
                        <a
                            href={`${mainAppUrl}/login`}
                            className="flex items-center justify-center gap-2 text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
                        >
                            More login options
                            <ExternalLink className="w-4 h-4" />
                        </a>

                        {/* Sign Up Link */}
                        <div className="mt-3 text-center text-sm text-slate-600 dark:text-slate-400">
                            Don't have an account?{' '}
                            <a
                                href={`${mainAppUrl}/signup`}
                                className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
                            >
                                Sign up
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginDropdown;
