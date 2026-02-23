import { prisma } from '@/lib/prisma';
import OrderCard from '@/components/OrderCard';
import CheckoutDashboard from '@/components/CheckoutDashboard';
import { ClipboardList } from 'lucide-react';
import { getActiveSessions, getBills, isAdmin } from '@/app/actions';
import AdminHeader from '@/components/AdminHeader';
import BillHistory from '@/components/BillHistory';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function AdminPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string }>;
}) {
    if (!(await isAdmin())) {
        redirect('/admin/login');
    }

    const { tab = 'orders' } = await searchParams;

    // Fetch orders (existing logic)
    const orders = await prisma.order.findMany({
        where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }, // Show last 24h by default
        orderBy: [
            { floorNumber: 'asc' },
            { createdAt: 'desc' }
        ],
        include: {
            items: {
                include: {
                    menuItem: true,
                },
            },
        },
    }) as any[];

    // Fetch active sessions for billing
    const activeSessions = await getActiveSessions();
    const bills = await getBills();

    const pendingCount = orders.filter(o => o.status === 'PENDING').length;
    const inProgressCount = orders.filter(o => o.status === 'IN_PROGRESS').length;

    return (
        <main className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <Suspense fallback={<div>Loading Header...</div>}>
                    <AdminHeader />
                </Suspense>

                {tab === 'orders' ? (
                    <>
                        <div className="flex gap-4 mb-8">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1 md:flex-none md:min-w-[150px]">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pending</p>
                                <p className="text-2xl font-black text-yellow-600">{pendingCount}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1 md:flex-none md:min-w-[150px]">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">In Progress</p>
                                <p className="text-2xl font-black text-blue-600">{inProgressCount}</p>
                            </div>
                        </div>

                        {orders.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200 border-dashed">
                                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ClipboardList className="text-gray-400" size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">No active orders</h2>
                                <p className="text-gray-500">Guest orders from the last 24h will appear here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {orders.map((order) => (
                                    <OrderCard key={order.id} order={order} />
                                ))}
                            </div>
                        )}
                    </>
                ) : tab === 'billing' ? (
                    <CheckoutDashboard sessions={activeSessions} />
                ) : (
                    <BillHistory bills={bills} />
                )}
            </div>
        </main>
    );
}
