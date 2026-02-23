'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-2xl font-black flex items-center gap-3 shadow-2xl shadow-blue-200 transition-all active:scale-95 text-lg"
        >
            <Printer size={24} />
            Print Final Bill
        </button>
    );
}
