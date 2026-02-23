'use client';

import React, { useState } from 'react';
import { markBillAsPaid } from '@/app/actions';
import { CheckCircle2, Clock, History as HistoryIcon } from 'lucide-react';

export default function BillHistory({ bills: initialBills }: { bills: any[] }) {
    const [bills, setBills] = useState(initialBills);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleMarkAsPaid = async (billId: number) => {
        setIsUpdating(true);
        const result = await markBillAsPaid(billId);
        if (result.success) {
            setBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'PAID' } : b));
        } else {
            alert('Failed to update status');
        }
        setIsUpdating(false);
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <HistoryIcon size={18} className="text-blue-600" />
                    Billing History
                </h2>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{bills.length} Records Total</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">ID</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Room</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Date</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium">
                        {bills.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">No historical records found.</td>
                            </tr>
                        ) : (
                            bills.map((bill) => (
                                <tr key={bill.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4 text-xs text-gray-400 font-mono">#{bill.id.toString().padStart(4, '0')}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg font-bold">Room {bill.room_id}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                                        {new Date(bill.created_at).toLocaleDateString([], { dateStyle: 'medium' })}
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-blue-600">
                                        ₹{bill.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {bill.status === 'PAID' ? (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 justify-center w-fit mx-auto">
                                                <CheckCircle2 size={12} /> Paid
                                            </span>
                                        ) : (
                                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 justify-center w-fit mx-auto">
                                                <Clock size={12} /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => window.open(`/admin/invoice/${bill.id}`, '_blank')}
                                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                                        >
                                            View/Print
                                        </button>
                                        {bill.status !== 'PAID' && (
                                            <button
                                                onClick={() => handleMarkAsPaid(bill.id)}
                                                disabled={isUpdating}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                                            >
                                                Mark Paid
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
