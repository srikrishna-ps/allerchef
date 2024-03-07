import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitted(true);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#E6F2EA]">
            <div className="allerchef-card max-w-md w-full mx-auto p-8 text-center">
                <h1 className="text-2xl font-bold mb-4 allerchef-text-gradient">Forgot your password?</h1>
                {submitted ? (
                    <div className="text-green-700 font-medium">If this email exists, a reset link will be sent.</div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block mb-1 font-medium">Email</label>
                            <Input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <Button type="submit" className="w-full mt-2 rounded-xl text-base font-semibold shadow-md">Send Reset Link</Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword; 