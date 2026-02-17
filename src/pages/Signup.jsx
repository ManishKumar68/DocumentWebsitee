import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Lock, Eye, EyeOff, AlertCircle, Check, X, Loader2 } from 'lucide-react';
import axios from 'axios';

const Signup = ({ onSwitchToLogin, darkMode, getInitialData }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();

    // Username availability state
    const [usernameStatus, setUsernameStatus] = useState(null); // null, 'checking', 'available', 'taken'
    const [usernameMessage, setUsernameMessage] = useState('');

    // Check username availability with debounce
    useEffect(() => {
        if (username.length < 3) {
            setUsernameStatus(null);
            setUsernameMessage('');
            return;
        }

        setUsernameStatus('checking');

        const timer = setTimeout(async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/auth/check-username/${username}`);
                if (response.data.available) {
                    setUsernameStatus('available');
                    setUsernameMessage('Username is available!');
                } else {
                    setUsernameStatus('taken');
                    setUsernameMessage('Username is already taken');
                }
            } catch (error) {
                setUsernameStatus(null);
                setUsernameMessage('');
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [username]);

    const passwordRequirements = [
        { text: 'At least 6 characters', met: password.length >= 6 },
        { text: 'Contains a number', met: /\d/.test(password) },
        { text: 'Passwords match', met: password === confirmPassword && confirmPassword !== '' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (username.length < 3) {
            setError('Username must be at least 3 characters');
            setLoading(false);
            return;
        }

        if (usernameStatus === 'taken') {
            setError('Username is already taken. Please choose a different one.');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Get initial document data to save with user
        const initialData = getInitialData ? getInitialData() : {};

        const result = await signup(username, password, initialData);
        if (!result.success) {
            setError(result.message);
        }
        setLoading(false);
    };

    // Get border color based on username status
    const getUsernameBorderClass = () => {
        if (usernameStatus === 'available') {
            return darkMode
                ? 'border-emerald-500 focus:border-emerald-400'
                : 'border-emerald-500 focus:border-emerald-600';
        }
        if (usernameStatus === 'taken') {
            return darkMode
                ? 'border-red-500 focus:border-red-400'
                : 'border-red-500 focus:border-red-600';
        }
        return darkMode
            ? 'border-gray-600 focus:border-emerald-500'
            : 'border-gray-300 focus:border-emerald-500';
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100'}`}>
            <div className={`w-full max-w-md ${darkMode ? 'bg-gray-800/80 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl'} rounded-2xl shadow-2xl p-8 border ${darkMode ? 'border-gray-700' : 'border-white/50'}`}>
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${darkMode ? 'bg-gradient-to-br from-emerald-600 to-teal-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'} shadow-lg`}>
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Create Account</h1>
                    <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sign up to start managing your documents</p>
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
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                                className={`w-full pl-11 pr-12 py-3 rounded-xl border ${getUsernameBorderClass()} ${darkMode ? 'bg-gray-700/50 text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'} focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none`}
                                placeholder="Choose a unique username"
                            />
                            {/* Status icon */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {usernameStatus === 'checking' && (
                                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                                )}
                                {usernameStatus === 'available' && (
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                                {usernameStatus === 'taken' && (
                                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                                        <X className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Username status message */}
                        {usernameMessage && (
                            <p className={`mt-2 text-xs font-medium ${usernameStatus === 'available' ? 'text-emerald-500' : 'text-red-500'}`}>
                                {usernameMessage}
                            </p>
                        )}
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
                                className={`w-full pl-11 pr-12 py-3 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:border-emerald-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-emerald-500'} focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none`}
                                placeholder="Create a password"
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

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full pl-11 pr-12 py-3 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:border-emerald-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-emerald-500'} focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none`}
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Password Requirements */}
                    {password && (
                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                            <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Password Requirements</p>
                            <div className="space-y-1">
                                {passwordRequirements.map((req, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-emerald-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                                            {req.met && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className={`text-xs ${req.met ? 'text-emerald-500' : darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{req.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || usernameStatus === 'taken' || usernameStatus === 'checking'}
                        className={`w-full py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] ${loading || usernameStatus === 'taken' || usernameStatus === 'checking' ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl'}`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Creating account...
                            </span>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                {/* Switch to Login */}
                <div className="mt-6 text-center">
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Already have an account?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="text-emerald-500 hover:text-emerald-400 font-semibold transition-colors"
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
