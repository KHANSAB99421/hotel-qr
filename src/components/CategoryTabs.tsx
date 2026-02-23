'use client';

import React from 'react';

interface CategoryTabsProps {
    categories: string[];
    activeCategory: string;
    onSelectCategory: (category: string) => void;
}

export default function CategoryTabs({ categories, activeCategory, onSelectCategory }: CategoryTabsProps) {
    return (
        <div className="flex overflow-x-auto py-4 space-x-2 no-scrollbar px-4 bg-white sticky top-0 z-10 border-b">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
