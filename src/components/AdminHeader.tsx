'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutDashboard, ListChecks, ReceiptCent, ArrowLeft, Home, LogOut, QrCode, History as HistoryIcon } from 'lucide-react';
import { HOTEL_NAME } from '@/lib/constants';
import { logoutAdmin } from '@/app/actions';

export default function AdminHeader() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || 'orders';

    const handleBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
        } else {
            router.push('/admin');
        }
    };

    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 shadow-sm transition-all active:scale-95 text-sm font-bold"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    <button
                        onClick={() => router.push('/admin')}
                        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 shadow-sm transition-all active:scale-95 text-sm font-bold"
                    >
                        <Home size={16} />
                        Dashboard
                    </button>
                    <button
                        onClick={() => router.push('/admin/qr')}
                        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 shadow-sm transition-all active:scale-95 text-sm font-bold"
                    >
                        <QrCode size={16} />
                        QR Codes
                    </button>
                    <button
                        onClick={async () => {
                            await logoutAdmin();
                            router.push('/admin/login');
                        }}
                        className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl border border-red-100 shadow-sm transition-all active:scale-95 text-sm font-bold"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
                        <LayoutDashboard size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{HOTEL_NAME}</h1>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Service Dashboard</p>
                    </div>
                </div>
            </div>

            <div className="flex p-1 bg-white rounded-2xl border border-gray-200 shadow-sm self-start md:self-end h-fit">
                <button
                    onClick={() => router.push('/admin?tab=orders')}
                    className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${tab === 'orders' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <ListChecks size={18} />
                    Orders
                </button>
                <button
                    onClick={() => router.push('/admin?tab=billing')}
                    className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${tab === 'billing' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <ReceiptCent size={18} />
                    Billing
                </button>
                <button
                    onClick={() => router.push('/admin?tab=history')}
                    className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${tab === 'history' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <HistoryIcon size={18} />
                    History
                </button>
            </div>
        </header>
    );
}
