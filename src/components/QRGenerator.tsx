'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Printer, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface QRGeneratorProps {
    baseUrl?: string;
}

export default function QRGenerator({ baseUrl }: QRGeneratorProps) {
    const rooms = [
        '101', '102', '103', '104', '105', '106',
        '201', '202', '203', '204', '205', '206',
        '301', '302', '303', '304', '305', '306'
    ];

    const handlePrint = () => {
        window.print();
    };

    return (
        <main className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                {!baseUrl && (
                    <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 flex items-center gap-3 print:hidden">
                        <div className="bg-amber-200 p-2 rounded-lg font-bold">!</div>
                        <p className="font-medium text-sm">
                            Configuration Warning: <strong>NEXT_PUBLIC_BASE_URL</strong> is not defined in your environment variables.
                            QR codes will fallback to current browser host.
                        </p>
                    </div>
                )}

                <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 print:hidden">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100">
                            <QrCode size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">QR Code Manager</h1>
                            <p className="text-gray-500 font-medium">Generate and print room ordering codes</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <button
                            onClick={handlePrint}
                            className="flex items-center justify-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-xl font-bold shadow-sm border border-gray-200 hover:bg-gray-50 transition-all active:scale-95"
                        >
                            <Printer size={20} />
                            Print All Codes
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {!baseUrl ? (
                        <div className="col-span-full p-12 bg-white rounded-3xl border-2 border-dashed border-red-500 text-center">
                            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                                <QrCode size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">CRITICAL: Base URL Missing</h2>
                            <p className="text-gray-600 max-w-lg mx-auto mb-8 font-medium">
                                QR Code Generation is DISABLED because <strong>NEXT_PUBLIC_BASE_URL</strong> is not set in your <code>.env</code> file.
                                <br /><br />
                                To fix this, add:<br />
                                <code className="bg-gray-100 p-2 rounded block mt-2 font-black text-blue-600">NEXT_PUBLIC_BASE_URL=http://your-lan-ip:3000</code>
                            </p>
                        </div>
                    ) : (
                        rooms.map((room) => {
                            const url = `${baseUrl}/guest/${room}`;
                            return (
                                <div key={room} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 flex flex-col items-center text-center group transition-all hover:shadow-md break-inside-avoid">
                                    <div className="mb-6 p-4 bg-gray-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                                        <QRCodeSVG value={url} size={150} level="H" includeMargin={false} />
                                    </div>

                                    <h2 className="text-2xl font-black text-gray-900 mb-1">Room {room}</h2>
                                    <p className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-widest">Scan to order</p>

                                    {/* Debug/Verification URL */}
                                    <div className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 mb-6">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Generated URL</p>
                                        <p className="text-xs font-mono text-indigo-600 font-bold break-all select-all">{url}</p>
                                    </div>

                                    <div className="w-full pt-6 border-t border-gray-100 flex items-center justify-between print:hidden">
                                        <Link
                                            href={`/guest/${room}`}
                                            target="_blank"
                                            className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                                        >
                                            Preview <ExternalLink size={12} />
                                        </Link>
                                        <span className="text-[10px] text-gray-300 font-bold uppercase tracking-tighter">Valid LAN Link</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <footer className="mt-20 p-8 bg-blue-50 rounded-3xl text-sm text-blue-800 flex items-start gap-4 print:hidden">
                    <div className="bg-blue-200 p-2 rounded-lg">
                        <Printer size={18} />
                    </div>
                    <div>
                        <p className="font-bold mb-1">Printing Instructions</p>
                        <ul className="list-disc list-inside space-y-1 opacity-80">
                            <li>Use "Save as PDF" or print directly to your preferred printer</li>
                            <li>Set layout to "Grid" if your printer supports it, or use the default optimized layout</li>
                            <li>The system is designed to automatically hide buttons and extra text when printing</li>
                        </ul>
                    </div>
                </footer>
            </div>
        </main>
    );
}
