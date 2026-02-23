'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/app/actions';
import { Lock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { HOTEL_NAME } from '@/lib/constants';

export default function AdminLogin() {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await loginAdmin(pin);

        if (result.success) {
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/admin');
                router.refresh();
            }, 1000);
        } else {
            setError(result.error || 'Invalid PIN');
            setPin('');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white">
                    <div className="bg-gray-900 p-8 text-center">
                        <div className="inline-flex bg-gray-800 p-4 rounded-2xl text-blue-400 mb-4">
                            <Lock size={32} />
                        </div>
                        <h1 className="text-xl font-black text-white uppercase tracking-tight">{HOTEL_NAME}</h1>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Admin Access</p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                    Enter Security PIN
                                </label>
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    maxLength={4}
                                    placeholder="••••"
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-center text-4xl tracking-[1em] font-black focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-200"
                                    required
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 animate-shake">
                                    <ShieldAlert size={20} />
                                    <p className="text-sm font-bold">{error}</p>
                                </div>
                            )}

                            {isSuccess && (
                                <div className="flex items-center gap-3 bg-green-50 text-green-600 p-4 rounded-2xl border border-green-100">
                                    <CheckCircle2 size={20} />
                                    <p className="text-sm font-bold">Access Granted. Redirecting...</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading || isSuccess}
                                className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 ${isLoading || isSuccess ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                                    }`}
                            >
                                {isLoading ? 'Verifying...' : 'Unlock Dashboard'}
                            </button>
                        </form>
                    </div>
                </div>

                <p className="text-center mt-8 text-gray-400 text-sm font-medium">
                    Restricted Area. Authorized Personnel Only.
                </p>
            </div>
        </div>
    );
}
