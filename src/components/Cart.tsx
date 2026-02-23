'use client';

import React from 'react';
import { ShoppingCart, Send, X } from 'lucide-react';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartProps {
    items: CartItem[];
    onSubmit: () => void;
    onClose: () => void;
    isSubmitting: boolean;
}

export default function Cart({ items, onSubmit, onClose, isSubmitting }: CartProps) {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (items.length === 0) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <ShoppingCart size={20} /> Your Order
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                    {item.quantity} x {item.price > 0 ? `$${item.price.toFixed(2)}` : 'Free'}
                                </p>
                            </div>
                            <p className="font-bold">
                                {item.price > 0 ? `$${(item.price * item.quantity).toFixed(2)}` : 'Free'}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <span className="animate-pulse">Placing Order...</span>
                        ) : (
                            <>
                                <Send size={20} /> Place Order via WhatsApp
                            </>
                        )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-2">
                        No payment required here. Bill will be added to your room.
                    </p>
                </div>
            </div>
        </div>
    );
}
