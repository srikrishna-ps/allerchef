import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import { useAuthStore } from "@/context/AuthContext";

function validatePassword(password: string) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}

const AuthModal = ({ open, onClose, hideClose = false, clearFieldsOnClose = false }: { open: boolean, onClose: () => void, hideClose?: boolean, clearFieldsOnClose?: boolean }) => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showRegPassword, setShowRegPassword] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register } = useAuthStore();

    function clearFields() {
        setLoginEmail('');
        setLoginPassword('');
        setRegName('');
        setRegEmail('');
        setRegPassword('');
    }

    useEffect(() => {
        if (!open && clearFieldsOnClose) {
            clearFields();
            setError('');
        }
    }, [open, clearFieldsOnClose]);

    useEffect(() => {
        // Handle Google OAuth callback
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('allerchef_token', token);
            window.location.replace('/'); // Redirect to home or desired page
        }
    }, [location.search]);

    if (!open) return null;

    const GoogleIcon = (
        <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle mr-2">
            <g clipPath="url(#clip0_17_40)">
                <path d="M47.5 24.5C47.5 22.6 47.3 20.8 47 19H24V29.1H37.4C36.7 32.2 34.7 34.7 31.8 36.4V42.1H39.5C44.1 38 47.5 31.9 47.5 24.5Z" fill="#4285F4" />
                <path d="M24 48C30.6 48 36.1 45.9 39.5 42.1L31.8 36.4C29.9 37.6 27.3 38.4 24 38.4C17.7 38.4 12.2 34.3 10.3 28.7H2.3V34.6C5.7 41.1 14.1 48 24 48Z" fill="#34A853" />
                <path d="M10.3 28.7C9.8 27.5 9.5 26.2 9.5 24.8C9.5 23.4 9.8 22.1 10.3 20.9V15H2.3C0.8 18.1 0 21.4 0 24.8C0 28.2 0.8 31.5 2.3 34.6L10.3 28.7Z" fill="#FBBC05" />
                <path d="M24 9.6C27.7 9.6 30.7 10.9 32.7 12.7L39.7 6.1C36.1 2.7 30.6 0 24 0C14.1 0 5.7 6.9 2.3 15L10.3 20.9C12.2 15.3 17.7 9.6 24 9.6Z" fill="#EA4335" />
            </g>
            <defs>
                <clipPath id="clip0_17_40">
                    <rect width="48" height="48" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        if (!regName || !regEmail || !regPassword) {
            setError('Please fill all fields.');
            return;
        }
        if (!validatePassword(regPassword)) {
            setError('Password must be at least 8 characters, include upper, lower, number, and symbol.');
            return;
        }
        try {
            await register(regName, regEmail, regPassword);
            setError('');
            window.alert('Registration successful!');
            clearFields();
            onClose();
            navigate('/');
        } catch (error) {
            setError('Registration failed.');
            window.alert('Registration failed.');
        }
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        try {
            await login(loginEmail, loginPassword);
            setError('');
            window.alert('Login successful!');
            clearFields();
            onClose();
            navigate('/');
        } catch (error) {
            setError('Login failed.');
            window.alert('Login failed.');
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl mx-auto rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/40 shadow-2xl flex flex-col md:flex-row overflow-hidden">
                {/* Close button */}
                {!hideClose && (
                    <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-10 h-10 w-10 flex items-center justify-center text-3xl font-bold rounded-full bg-white/80 shadow-lg border border-gray-200 transition-all hover:bg-white"
                        style={{ lineHeight: 1 }}
                        onClick={onClose}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                )}
                {/* Left: Form */}
                <div className="flex-1 flex flex-col justify-center p-8 md:p-12 bg-white">
                    <div className="flex justify-center mb-8 gap-2">
                        <Button
                            variant={mode === 'login' ? 'default' : 'outline'}
                            className={`rounded-full px-6 py-2 font-semibold text-base ${mode === 'login' ? '' : 'bg-white/70'}`}
                            onClick={() => { setMode('login'); setError(''); }}
                        >
                            Login
                        </Button>
                        <Button
                            variant={mode === 'register' ? 'default' : 'outline'}
                            className={`rounded-full px-6 py-2 font-semibold text-base ${mode === 'register' ? '' : 'bg-white/70'}`}
                            onClick={() => { setMode('register'); setError(''); }}
                        >
                            Register
                        </Button>
                    </div>
                    {/* Social Login Buttons */}
                    <div className="flex flex-col gap-3 mb-6">
                        <Button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 font-semibold shadow-sm hover:bg-gray-50 transition-all rounded-xl" type="button" onClick={() => window.location.href = '/api/auth/google'}>
                            {GoogleIcon} Continue with Google
                        </Button>
                    </div>
                    <div className="relative flex items-center mb-6">
                        <div className="flex-grow border-t border-gray-300" />
                        <span className="mx-4 text-gray-500 text-sm">or</span>
                        <div className="flex-grow border-t border-gray-300" />
                    </div>
                    {error && <div className="mb-4 text-red-600 text-center font-medium">{error}</div>}
                    {mode === 'login' ? (
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label className="block mb-1 font-medium">Email</label>
                                <Input type="email" placeholder="you@email.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                            </div>
                            <div className="relative">
                                <label className="block mb-1 font-medium">Password</label>
                                <Input type={showPassword ? "text" : "password"} placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                                <button
                                    type="button"
                                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-800 focus:outline-none"
                                    tabIndex={-1}
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <div className="flex justify-end mb-2">
                                <Link to="/forgot-password" className="text-sm text-green-700 hover:underline font-medium">Forgot your password?</Link>
                            </div>
                            <Button type="submit" className="w-full mt-2 rounded-xl text-base font-semibold shadow-md">Login</Button>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleRegister}>
                            <div>
                                <label className="block mb-1 font-medium">Name</label>
                                <Input type="text" placeholder="Your Name" value={regName} onChange={e => setRegName(e.target.value)} />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Email</label>
                                <Input type="email" placeholder="you@email.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                            </div>
                            <div className="relative">
                                <label className="block mb-1 font-medium">Password</label>
                                <Input type={showRegPassword ? "text" : "password"} placeholder="Password" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                                <button
                                    type="button"
                                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-800 focus:outline-none"
                                    tabIndex={-1}
                                    onClick={() => setShowRegPassword((v) => !v)}
                                    aria-label={showRegPassword ? "Hide password" : "Show password"}
                                >
                                    {showRegPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <Button type="submit" className="w-full mt-4 rounded-xl text-base font-semibold shadow-md">Register</Button>
                        </form>
                    )}
                </div>
                {/* Right: Image */}
                <div className="hidden md:block flex-1 relative min-h-[400px]">
                    <img
                        src={heroImage}
                        alt="Healthy cooking"
                        className="absolute inset-0 w-full h-full object-cover object-center rounded-l-none rounded-r-3xl"
                        style={{ minHeight: 400 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthModal; 