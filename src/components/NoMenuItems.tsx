'use client';

import React from 'react';

export default function NoMenuItems() {
    return (
        <main className="max-w-md mx-auto min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-6 text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No menu items available</h2>
            <p className="text-gray-500 mb-8">Please contact reception or housekeeping for assistance.</p>
            <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold active:scale-95 transition-all"
            >
                Refresh Page
            </button>
        </main>
    );
}
