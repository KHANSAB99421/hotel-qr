'use client';

import React from 'react';
import { updateOrderStatus } from '@/app/actions';
import { Clock, CheckCircle, PlayCircle, Loader2 } from 'lucide-react';

interface OrderItem {
    menuItem: {
        name: string;
        category: string;
    };
    quantity: number;
}

interface Order {
    id: string;
    roomNumber: string;
    floorNumber: number;
    status: string;
    totalPrice: number;
    createdAt: Date;
    items: OrderItem[];
}

interface OrderCardProps {
    order: Order;
}

const statusConfig: Record<string, { label: string, color: string, icon: any }> = {
    PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: PlayCircle },
    DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
};

export default function OrderCard({ order }: OrderCardProps) {
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    const StatusIcon = statusConfig[order.status].icon;

    const handleStatusUpdate = async (newStatus: string) => {
        setIsUpdating(true);
        await updateOrderStatus(order.id, newStatus);
        setIsUpdating(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold">Room {order.roomNumber} <span className="text-sm font-normal text-gray-500">(Floor {order.floorNumber})</span></h3>
                    <p className="text-xs text-blue-600 font-medium mb-1">
                        {Array.from(new Set(order.items.map(i => i.menuItem.category))).join(' / ')}
                    </p>
                    <p className="text-xs text-gray-500">
                        {mounted ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                    </p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig[order.status].color}`}>
                    <StatusIcon size={14} />
                    {statusConfig[order.status].label}
                </div>
            </div>

            <div className="p-4 flex-1 space-y-2">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                            <span className="font-bold text-gray-800">{item.quantity}x</span> {item.menuItem.name}
                        </span>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-500">Total</span>
                    <span className="font-bold text-lg text-blue-600">${order.totalPrice.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {order.status === 'PENDING' && (
                        <button
                            onClick={() => handleStatusUpdate('IN_PROGRESS')}
                            disabled={isUpdating}
                            className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            {isUpdating ? <Loader2 className="animate-spin" size={18} /> : 'Start Preparing'}
                        </button>
                    )}
                    {order.status === 'IN_PROGRESS' && (
                        <button
                            onClick={() => handleStatusUpdate('DELIVERED')}
                            disabled={isUpdating}
                            className="col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            {isUpdating ? <Loader2 className="animate-spin" size={18} /> : 'Mark as Delivered'}
                        </button>
                    )}
                    {order.status === 'DELIVERED' && (
                        <button
                            onClick={() => handleStatusUpdate('PENDING')}
                            disabled={isUpdating}
                            className="col-span-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            Re-open Order
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
