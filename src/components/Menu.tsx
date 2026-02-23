'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CategoryTabs from '@/components/CategoryTabs';
import MenuItemCard from '@/components/MenuItemCard';
import Cart from '@/components/Cart';
import { createOrder } from '@/app/actions';
import { ShoppingCart, ArrowLeft, Home } from 'lucide-react';

interface MenuItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
    category: string;
}

interface MenuProps {
    roomNumber: string;
    initialItems: MenuItem[];
}

export default function Menu({ roomNumber, initialItems }: MenuProps) {
    const router = useRouter();
    const categories = Array.from(new Set(initialItems.map((item) => item.category)));
    const [activeCategory, setActiveCategory] = useState(categories[0] || '');
    const [cart, setCart] = useState<Record<string, number>>({});
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredItems = initialItems.filter((item) => item.category === activeCategory);

    const handleBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };

    const addToCart = (id: string) => {
        setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => {
            const newCart = { ...prev };
            if (newCart[id] > 1) {
                newCart[id] -= 1;
            } else {
                delete newCart[id];
            }
            return newCart;
        });
    };

    const cartItems = Object.entries(cart).map(([id, quantity]) => {
        const item = initialItems.find((i) => i.id === id)!;
        return { ...item, quantity };
    });

    const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleOrder = async () => {
        const phone = process.env.NEXT_PUBLIC_HOTEL_WHATSAPP;
        if (!phone) {
            alert('Service temporary unavailable: Hotel WhatsApp contact missing.');
            return;
        }

        setIsSubmitting(true);
        const result = await createOrder({
            roomNumber,
            items: cartItems.map(i => ({ id: i.id, quantity: i.quantity })),
            totalPrice: total,
            category: activeCategory
        });

        if (result.success && result.order) {
            const order = result.order as any;
            const itemsText = order.items.map((i: any) => `- ${i.menuItem.name} x${i.quantity}`).join('\n');
            const floor = Math.floor(Number(order.roomNumber) / 100);

            const message = `New Order 🛎️
Room: ${order.roomNumber} (Floor ${floor})
Category: ${order.category}

Items:
${itemsText}

Total: ₹${order.totalPrice}`;

            const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

            setCart({});
            setIsCartOpen(false);
            window.location.href = whatsappUrl;
        } else {
            alert('Failed to place order. Please try again.');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="pb-24 min-h-screen bg-white">
            <div className="p-6 bg-blue-600 text-white shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all active:scale-95"
                    >
                        <ArrowLeft size={18} />
                        <span className="font-bold text-sm">Back</span>
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all active:scale-95"
                    >
                        <Home size={18} />
                        <span className="font-bold text-sm">Home</span>
                    </button>
                </div>
                <h1 className="text-3xl font-black italic">Room {roomNumber}</h1>
                <p className="opacity-80 font-medium tracking-wide">Quick Service Menu</p>
            </div>

            <CategoryTabs
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
            />

            <div className="divide-y">
                {filteredItems.map((item) => (
                    <MenuItemCard
                        key={item.id}
                        item={item}
                        quantity={cart[item.id] || 0}
                        onAdd={() => addToCart(item.id)}
                        onRemove={() => removeFromCart(item.id)}
                    />
                ))}
            </div>

            {cartCount > 0 && (
                <div className="fixed bottom-6 left-6 right-6 z-40">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-2xl flex items-center justify-between px-6 transition-all transform active:scale-95"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <ShoppingCart size={20} />
                            </div>
                            <span>View Order ({cartCount})</span>
                        </div>
                        <span className="text-xl">${total.toFixed(2)}</span>
                    </button>
                </div>
            )}

            {isCartOpen && (
                <Cart
                    items={cartItems}
                    onClose={() => setIsCartOpen(false)}
                    onSubmit={handleOrder}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
}
