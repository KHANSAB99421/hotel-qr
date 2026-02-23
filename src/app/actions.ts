'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const ADMIN_PIN = process.env.ADMIN_PIN || '1234';

export async function loginAdmin(pin: string) {
    if (pin === ADMIN_PIN) {
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_SET === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 hours
        });
        return { success: true };
    }
    return { success: false, error: 'Invalid PIN' };
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    revalidatePath('/admin');
}

export async function isAdmin() {
    const cookieStore = await cookies();
    return cookieStore.get('admin_session')?.value === 'true';
}

export async function createOrder(formData: {
    roomNumber: string;
    items: { id: string; quantity: number }[];
    totalPrice: number;
    category: string;
}) {
    try {
        const roomNum = parseInt(formData.roomNumber);
        const floorNumber = Math.floor(roomNum / 100);

        // Session Management: Find or create active session
        let session = await prisma.session.findFirst({
            where: {
                roomNumber: formData.roomNumber,
                active: true
            }
        });

        if (!session) {
            // Find room ID for the relation if we wanted formal normalization, 
            // but for now we follow the user's specific fields + session tracking
            session = await prisma.session.create({
                data: {
                    roomNumber: formData.roomNumber,
                    room_id: roomNum,
                    active: true
                }
            });
        }

        // Fetch menu items to get current price for snapshot
        const menuItemIds = formData.items.map(item => item.id);
        const menuItems = await prisma.menuItem.findMany({
            where: { id: { in: menuItemIds } }
        });

        const order = await prisma.order.create({
            data: {
                roomNumber: formData.roomNumber,
                floorNumber: floorNumber,
                category: formData.category,
                totalPrice: formData.totalPrice,
                status: 'PENDING',
                sessionId: session.id,
                items: {
                    create: formData.items.map((item) => {
                        const menuItem = menuItems.find(m => m.id === item.id);
                        return {
                            menuItemId: item.id,
                            quantity: item.quantity,
                            priceAtTimeOfOrder: menuItem?.price || 0
                        };
                    }),
                },
            },
            include: {
                items: {
                    include: {
                        menuItem: true,
                    },
                },
            },
        });

        // Update session total
        await prisma.session.update({
            where: { id: session.id },
            data: {
                totalAmount: {
                    increment: formData.totalPrice
                }
            }
        });

        revalidatePath('/admin');

        return { success: true, order: order as any };
    } catch (error) {
        console.error('Order creation failed:', error);
        return { success: false, error: 'Failed to place order' };
    }
}

export async function updateOrderStatus(orderId: string, status: string) {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized' };
    }
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Update status failed:', error);
        return { success: false };
    }
}

export async function checkoutRoom(sessionId: number) {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized' };
    }
    try {
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                orders: {
                    include: {
                        items: {
                            include: {
                                menuItem: true
                            }
                        }
                    }
                }
            }
        });

        if (!session) return { success: false, error: 'Session not found' };

        // Create the items JSON snapshot
        const items = session.orders.flatMap((order: any) =>
            order.items.map((item: any) => ({
                name: item.menuItem.name,
                quantity: item.quantity,
                price: item.priceAtTimeOfOrder,
                total: item.priceAtTimeOfOrder * item.quantity,
                orderedAt: order.createdAt
            }))
        );

        const [bill] = await prisma.$transaction([
            prisma.bill.create({
                data: {
                    room_id: session.roomNumber,
                    session_id: session.id,
                    total: session.totalAmount,
                    items: JSON.stringify(items),
                    status: 'PENDING'
                }
            }),
            prisma.session.update({
                where: { id: sessionId },
                data: {
                    active: false,
                    checkoutAt: new Date()
                }
            })
        ]);

        revalidatePath('/admin');
        return { success: true, billId: bill.id };
    } catch (error) {
        console.error('Checkout failed:', error);
        return { success: false, error: 'Checkout failed' };
    }
}

export async function getBills(status?: string) {
    if (!(await isAdmin())) {
        throw new Error('Unauthorized');
    }
    return await prisma.bill.findMany({
        where: status ? { status } : {},
        orderBy: { created_at: 'desc' },
        include: {
            session: true
        }
    });
}

export async function getBillById(billId: number) {
    if (!(await isAdmin())) {
        throw new Error('Unauthorized');
    }
    return await prisma.bill.findUnique({
        where: { id: billId },
        include: {
            session: true
        }
    });
}

export async function markBillAsPaid(billId: number) {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized' };
    }
    try {
        await prisma.bill.update({
            where: { id: billId },
            data: { status: 'PAID' }
        });
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to mark bill as paid:', error);
        return { success: false, error: 'Update failed' };
    }
}

export async function getActiveSessions() {
    if (!(await isAdmin())) {
        throw new Error('Unauthorized');
    }
    return await prisma.session.findMany({
        where: { active: true },
        include: {
            orders: {
                include: {
                    items: {
                        include: {
                            menuItem: true
                        }
                    }
                }
            }
        },
        orderBy: { roomNumber: 'asc' }
    });
}

export async function updateGuestName(sessionId: number, guestName: string) {
    if (!(await isAdmin())) {
        return { success: false, error: 'Unauthorized' };
    }
    try {
        await prisma.session.update({
            where: { id: sessionId },
            data: { guestName }
        });
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Update guest name failed:', error);
        return { success: false, error: 'Update failed' };
    }
}

export async function getSessionById(sessionId: number) {
    if (!(await isAdmin())) {
        throw new Error('Unauthorized');
    }
    return await prisma.session.findUnique({
        where: { id: sessionId },
        include: {
            orders: {
                include: {
                    items: {
                        include: {
                            menuItem: true
                        }
                    }
                },
                orderBy: { createdAt: 'asc' }
            }
        }
    });
}
