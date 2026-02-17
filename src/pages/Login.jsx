import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = ({ onSwitchToSignup, darkMode }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!username.trim() || !password.trim()) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        const result = await login(username, password);
        if (!result.success) {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100'}`}>
            <div className={`w-full max-w-md ${darkMode ? 'bg-gray-800/80 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl'} rounded-2xl shadow-2xl p-8 border ${darkMode ? 'border-gray-700' : 'border-white/50'}`}>
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${darkMode ? 'bg-gradient-to-br from-purple-600 to-indigo-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'} shadow-lg`}>
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Welcome Back</h1>
                    <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sign in to access your documents</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Username
                        </label>
                        <div className="relative">
                            <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`w-full pl-11 pr-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:border-purple-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500'} focus:ring-2 focus:ring-purple-500/20 transition-all outline-none`}
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Password
                        </label>
                        <div className="relative">
                            <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full pl-11 pr-12 py-3 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:border-purple-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500'} focus:ring-2 focus:ring-purple-500/20 transition-all outline-none`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'}`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Switch to Signup */}
                <div className="mt-6 text-center">
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Don't have an account?{' '}
                        <button
                            onClick={onSwitchToSignup}
                            className="text-purple-500 hover:text-purple-400 font-semibold transition-colors"
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
