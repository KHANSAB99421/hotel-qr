import React from 'react';
import { getBillById, isAdmin } from '@/app/actions';
import { notFound, redirect } from 'next/navigation';
import { Building2, User, Hash, Calendar } from 'lucide-react';
import AdminHeader from '@/components/AdminHeader';
import PrintButton from '@/components/PrintButton';
import { HOTEL_NAME, HOTEL_ADDRESS_LINE1, HOTEL_ADDRESS_LINE2, HOTEL_CONTACT } from '@/lib/constants';

export default async function InvoicePage({ params }: { params: Promise<{ billId: string }> }) {
    if (!(await isAdmin())) {
        redirect('/admin/login');
    }

    const { billId: billIdStr } = await params;
    const billId = parseInt(billIdStr);
    const bill = await getBillById(billId);

    if (!bill) return notFound();

    const items = JSON.parse(bill.items);
    const billDate = new Date(bill.created_at);
    // Use session data for metadata, but fallback to snapshot info if needed
    const guestName = bill.session?.guestName || 'Guest';
    const roomNumber = bill.room_id || bill.session?.roomNumber || 'N/A';
    const checkinDate = bill.session ? new Date(bill.session.checkinAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'N/A';

    return (
        <main className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="print:hidden mb-8">
                    <AdminHeader />
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 print:shadow-none print:border-none print:rounded-none">
                    {/* Bill Header */}
                    <div className="p-8 md:p-12 border-b border-gray-100 bg-gray-50/50 print:bg-white flex flex-col md:flex-row justify-between items-start gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Building2 size={32} className="text-blue-600 print:text-black" />
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">{HOTEL_NAME}</h1>
                            </div>
                            <div className="space-y-1 text-gray-500 font-medium">
                                <p>{HOTEL_ADDRESS_LINE1}</p>
                                <p>{HOTEL_ADDRESS_LINE2}</p>
                                <p>Contact: {HOTEL_CONTACT}</p>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end print:items-end">
                            <span className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 print:bg-black print:text-white">Tax Invoice</span>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Bill # {bill.id.toString().padStart(6, '0')}</p>
                            <p className="text-lg font-black text-gray-900">{billDate.toLocaleDateString([], { dateStyle: 'long' })}</p>
                        </div>
                    </div>

                    {/* Stay Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b border-gray-100">
                        <div className="p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-2">
                                <User size={16} className="text-gray-400" />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Guest Name</span>
                            </div>
                            <p className="text-xl font-black text-gray-900">{guestName}</p>
                        </div>
                        <div className="p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-2">
                                <Hash size={16} className="text-gray-400" />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Room Number</span>
                            </div>
                            <p className="text-xl font-black text-gray-900">Room {roomNumber}</p>
                        </div>
                        <div className="p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar size={16} className="text-gray-400" />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Check-in</span>
                            </div>
                            <p className="text-sm font-bold text-gray-900">{checkinDate}</p>
                        </div>
                    </div>

                    {/* Bill Items */}
                    <div className="p-8 md:p-12">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-100 text-left">
                                    <th className="pb-4 text-xs font-black text-gray-400 uppercase tracking-widest">Description</th>
                                    <th className="pb-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Qty</th>
                                    <th className="pb-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Unit Price</th>
                                    <th className="pb-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {items.map((item: any, idx: number) => (
                                    <tr key={idx}>
                                        <td className="py-4 font-bold text-gray-800">{item.name}</td>
                                        <td className="py-4 text-center text-gray-600 font-medium">{item.quantity}</td>
                                        <td className="py-4 text-right text-gray-600 font-medium">₹{item.price.toFixed(2)}</td>
                                        <td className="py-4 text-right font-black text-gray-900">₹{item.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="p-8 md:p-12 bg-gray-900 text-white print:bg-white print:text-black print:border-t-2 print:border-gray-900">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 print:text-gray-400">Grand Total Paid</p>
                                <p className="text-5xl font-black tracking-tighter print:text-4xl text-blue-400 print:text-black">₹{bill.total.toFixed(2)}</p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest print:text-gray-400">Payment Status</p>
                                <p className="text-xl font-black italic uppercase tracking-tighter text-green-400 print:text-black">
                                    {bill.status === 'PAID' ? 'RECORDED AS PAID' : 'PENDING AT RECEPTION'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Print Control */}
                <div className="mt-8 flex justify-center print:hidden">
                    <PrintButton />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 1cm; }
                    body { background: white; }
                    main { padding: 0 !important; }
                    .max-w-4xl { max-width: 100% !important; }
                    .print\\:hidden { display: none !important; }
                }
            `}} />
        </main>
    );
}
