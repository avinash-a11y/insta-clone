"use client"
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Instagram, UserPlus, User, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { BASE_URL } from '@/utils/config';

const SignUpPage = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!usernameRef.current?.value || !emailRef.current?.value || !passwordRef.current?.value) {
            setError('Please fill in all fields');
            return;
        }
        
        try {
            setError('');
            setLoading(true);
            
            const response = await fetch(`${BASE_URL}/api/signup`, {
                method: "POST",
                body: JSON.stringify({ 
                    username: usernameRef.current?.value,
                    email: emailRef.current?.value,
                    password: passwordRef.current?.value
                })
            });
            
            const data = await response.json();
            
            if (data.message === "User created successfully") {
                router.push('/signin');
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
            console.error('Signup error:', error);
        } finally {
            setLoading(false);
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="relative w-20 h-20 mb-4">
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-2xl opacity-80 blur-lg animate-pulse"></div>
                            <div className="relative flex items-center justify-center w-full h-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
                                <Instagram className="h-10 w-10 text-gray-900 dark:text-white" />
                            </div>
                        </div>
                    </div>
                    <h2 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Join our community and start sharing your moments
                    </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-2xl space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    
                    <form className="space-y-6" onSubmit={handleSignup}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    ref={usernameRef}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                    placeholder="Choose a username"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    ref={emailRef}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    ref={passwordRef}
                                    required
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    onClick={togglePasswordVisibility}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transform transition hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5 mr-2" />
                                        Create Account
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link href="/signin" className="font-medium text-pink-600 hover:text-pink-500">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;