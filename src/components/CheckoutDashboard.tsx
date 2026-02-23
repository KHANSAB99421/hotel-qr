'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkoutRoom, updateGuestName } from '@/app/actions';
import { ReceiptCent, LogOut, CheckCircle2, History, User, Save } from 'lucide-react';

interface SessionItem {
    id: string;
    quantity: number;
    priceAtTimeOfOrder: number;
    menuItem: {
        name: string;
    };
}

interface Order {
    id: string;
    createdAt: string;
    items: SessionItem[];
}

interface ActiveSession {
    id: string;
    roomNumber: string;
    guestName?: string | null;
    checkinAt: Date | string;
    totalAmount: number;
    orders: Order[];
}

interface CheckoutDashboardProps {
    sessions: any[];
}

export default function CheckoutDashboard({ sessions: initialSessions }: CheckoutDashboardProps) {
    const router = useRouter();
    const [sessions, setSessions] = useState(initialSessions);
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [editingName, setEditingName] = useState('');
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const selectedSession = sessions.find(s => s.id === selectedSessionId);

    const handleCheckout = async (id: number) => {
        if (!confirm('Are you sure you want to checkout this room? This will lock the bill.')) return;

        setIsProcessing(true);
        const result = await checkoutRoom(id);
        if (result.success && result.billId) {
            router.push(`/admin/invoice/${result.billId}`);
        } else if (result.success) {
            router.refresh();
        } else {
            alert(result.error || 'Checkout failed');
            setIsProcessing(false);
        }
    };

    const handleUpdateName = async () => {
        if (!selectedSessionId) return;
        setIsProcessing(true);
        const result = await updateGuestName(selectedSessionId, editingName);
        if (result.success) {
            setSessions(prev => prev.map(s => s.id === selectedSessionId ? { ...s, guestName: editingName } : s));
            alert('Guest name updated!');
        } else {
            alert('Failed to update name.');
        }
        setIsProcessing(false);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Rooms List */}
            <div className="w-full lg:w-1/3 bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <History size={18} className="text-blue-600" />
                        Active Room Sessions
                    </h2>
                </div>
                <div className="divide-y overflow-y-auto max-h-[600px]">
                    {sessions.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <CheckCircle2 className="mx-auto mb-3 opacity-20" size={40} />
                            <p>No active sessions</p>
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <button
                                key={session.id}
                                onClick={() => {
                                    setSelectedSessionId(session.id);
                                    setEditingName(session.guestName || '');
                                }}
                                className={`w-full p-4 flex items-center justify-between hover:bg-blue-50 transition-colors ${selectedSessionId === session.id ? 'bg-blue-50' : ''}`}
                            >
                                <div className="text-left">
                                    <p className="text-sm font-bold text-gray-900">Room {session.roomNumber}</p>
                                    <p className="text-xs text-blue-600 font-medium truncate max-w-[120px]">{session.guestName || 'No guest name'}</p>
                                    <p className="text-[10px] text-gray-400">Since: {mounted ? new Date(session.checkinAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '...'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-blue-600">₹{session.totalAmount.toFixed(2)}</p>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">{session.orders.length} Orders</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Bill Details */}
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-200 min-h-[500px] flex flex-col transition-all">
                {selectedSession ? (
                    <>
                        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-2xl font-black text-gray-900">Room {selectedSession.roomNumber}</h2>
                                    <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active Stay</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100 mt-2 max-w-sm">
                                    <User size={16} className="text-gray-400 ml-1" />
                                    <input
                                        type="text"
                                        placeholder="Enter guest name..."
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        className="bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700 w-full placeholder:text-gray-300"
                                    />
                                    <button
                                        onClick={handleUpdateName}
                                        disabled={isProcessing || editingName === selectedSession.guestName}
                                        className="bg-white text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg border border-blue-100 shadow-sm transition-all active:scale-95 disabled:opacity-0 disabled:scale-90"
                                    >
                                        <Save size={16} />
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => handleCheckout(selectedSession.id)}
                                disabled={isProcessing}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-100 transition-all active:scale-95 disabled:opacity-50 h-fit"
                            >
                                <LogOut size={18} />
                                Checkout Room
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                            <div className="space-y-8">
                                {selectedSession.orders.map((order: any, idx: number) => (
                                    <div key={order.id} className="relative">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="bg-blue-50 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-sm border border-blue-100">
                                                {idx + 1}
                                            </div>
                                            <p className="text-sm font-bold text-gray-800">
                                                Order at {mounted ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }) : '...'}
                                            </p>
                                        </div>
                                        <div className="ml-11 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 space-y-4">
                                            {order.items.map((item: any) => (
                                                <div key={item.id} className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-bold text-gray-400 bg-white w-8 h-8 rounded-lg flex items-center justify-center shadow-sm border border-gray-100">{item.quantity}x</span>
                                                        <span className="text-gray-700 font-semibold">{item.menuItem.name}</span>
                                                    </div>
                                                    <span className="font-black text-gray-900 tracking-tight">₹{(item.priceAtTimeOfOrder * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-gray-900 border-t border-gray-800 rounded-b-3xl text-white shadow-2xl">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Stay Total for {selectedSession.guestName || `Room ${selectedSession.roomNumber}`}</p>
                                    <p className="text-5xl font-black text-white tracking-tighter">₹{selectedSession.totalAmount.toFixed(2)}</p>
                                </div>
                                <div className="text-right text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                                    <p>Final Billing</p>
                                    <p>Taxes included</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-gray-400">
                        <div className="bg-gray-50 p-8 rounded-full mb-6">
                            <ReceiptCent size={64} className="opacity-10" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Select a room</h3>
                        <p className="max-w-xs mx-auto text-sm font-medium">Click on a room from the left list to view their current bill and process checkout.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
