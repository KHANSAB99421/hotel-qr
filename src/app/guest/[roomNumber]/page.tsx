import { prisma } from '@/lib/prisma';
import Menu from '@/components/Menu';
import NoMenuItems from '@/components/NoMenuItems';

interface PageProps {
    params: Promise<{ roomNumber: string }>;
}

export default async function RoomPage({ params }: PageProps) {
    const { roomNumber } = await params;

    const items = await prisma.menuItem.findMany({
        where: { available: true },
        orderBy: { name: 'asc' },
    });

    if (items.length === 0) {
        return <NoMenuItems />;
    }

    return (
        <main className="max-w-md mx-auto min-h-screen bg-gray-50 shadow-sm">
            <Menu roomNumber={roomNumber} initialItems={items} />
        </main>
    );
}
