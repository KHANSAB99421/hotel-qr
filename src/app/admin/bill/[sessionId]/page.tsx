import React, { Fragment } from 'react';
import { getSessionById, isAdmin } from '@/app/actions';
import { notFound, redirect } from 'next/navigation';
import { Building2, User, Hash, Calendar } from 'lucide-react';
import AdminHeader from '@/components/AdminHeader';
import PrintButton from '@/components/PrintButton';
import { HOTEL_NAME, HOTEL_ADDRESS_LINE1, HOTEL_ADDRESS_LINE2, HOTEL_CONTACT } from '@/lib/constants';

export default async function BillPage({ params }: { params: Promise<{ sessionId: string }> }) {
    if (!(await isAdmin())) {
        redirect('/admin/login');
    }

    const { sessionId: sessionIdStr } = await params;
    const sessionId = parseInt(sessionIdStr);
    const session = await getSessionById(sessionId);

    if (!session || session.active) {
        // We only show bills for checked-out sessions
        // Or handle active sessions if we want "Provisional Bill"
    }

    if (!session) return notFound();

    const checkinDate = new Date(session.checkinAt);
    const checkoutDate = session.checkoutAt ? new Date(session.checkoutAt) : new Date();

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
                            <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 print:bg-black print:text-white">Final Invoice</span>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Invoice Date</p>
                            <p className="text-lg font-black text-gray-900">{checkoutDate.toLocaleDateString([], { dateStyle: 'long' })}</p>
                        </div>
                    </div>

                    {/* Stay Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b border-gray-100">
                        <div className="p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-2">
                                <User size={16} className="text-gray-400" />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Guest Name</span>
                            </div>
                            <p className="text-xl font-black text-gray-900">{session.guestName || 'Guest'}</p>
                        </div>
                        <div className="p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-2">
                                <Hash size={16} className="text-gray-400" />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Room Number</span>
                            </div>
                            <p className="text-xl font-black text-gray-900">Room {session.roomNumber}</p>
                        </div>
                        <div className="p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar size={16} className="text-gray-400" />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stay Period</span>
                            </div>
                            <p className="text-sm font-bold text-gray-900">
                                {checkinDate.toLocaleDateString([], { month: 'short', day: 'numeric' })} - {checkoutDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </p>
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
                                {session.orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-gray-400 font-mediumitalic">No orders recorded in this session.</td>
                                    </tr>
                                ) : (
                                    session.orders.map((order: any) => (
                                        <Fragment key={order.id}>
                                            <tr className="bg-gray-50/30 print:bg-white">
                                                <td colSpan={4} className="py-2 px-2 text-[10px] font-black text-blue-600/50 uppercase tracking-widest">
                                                    Order: {new Date(order.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                </td>
                                            </tr>
                                            {order.items.map((item: any) => (
                                                <tr key={item.id}>
                                                    <td className="py-4 font-bold text-gray-800">{item.menuItem.name}</td>
                                                    <td className="py-4 text-center text-gray-600 font-medium">{item.quantity}</td>
                                                    <td className="py-4 text-right text-gray-600 font-medium">₹{item.priceAtTimeOfOrder.toFixed(2)}</td>
                                                    <td className="py-4 text-right font-black text-gray-900">₹{(item.priceAtTimeOfOrder * item.quantity).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="p-8 md:p-12 bg-gray-900 text-white print:bg-white print:text-black print:border-t-2 print:border-gray-900">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 print:text-gray-400">Grand Total Payable</p>
                                <p className="text-5xl font-black tracking-tighter print:text-4xl text-blue-400 print:text-black">₹{session.totalAmount.toFixed(2)}</p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest print:text-gray-400">Payment Status</p>
                                <p className="text-xl font-black italic uppercase tracking-tighter text-green-400 print:text-black">Pending at Reception</p>
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
                }
            `}} />
        </main>
    );
}
