'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface MenuItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
    category: string;
}

interface MenuItemCardProps {
    item: MenuItem;
    quantity: number;
    onAdd: () => void;
    onRemove: () => void;
}

export default function MenuItemCard({ item, quantity, onAdd, onRemove }: MenuItemCardProps) {
    return (
        <div className="bg-white p-4 border-b flex justify-between items-center last:border-0 hover:bg-gray-50 transition-colors">
            <div className="flex-1 mr-4">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                {item.description && <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>}
                <p className="mt-1 font-bold text-blue-600">
                    {item.price > 0 ? `$${item.price.toFixed(2)}` : 'Free'}
                </p>
            </div>

            <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
                {quantity > 0 ? (
                    <>
                        <button
                            onClick={onRemove}
                            className="p-1 hover:text-blue-600 transition-colors"
                        >
                            <Minus size={20} />
                        </button>
                        <span className="w-6 text-center font-medium">{quantity}</span>
                        <button
                            onClick={onAdd}
                            className="p-1 hover:text-blue-600 transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={onAdd}
                        className="px-4 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                        Add
                    </button>
                )}
            </div>
        </div>
    );
}
