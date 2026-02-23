import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Clear existing (though already reset)
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.bill.deleteMany();
    await prisma.session.deleteMany();
    await prisma.room.deleteMany();
    await prisma.menuItem.deleteMany();

    // Seed Rooms
    const rooms = [
        { room_no: "101", floor: 1 },
        { room_no: "102", floor: 1 },
        { room_no: "201", floor: 2 },
        { room_no: "202", floor: 2 },
    ];

    for (const r of rooms) {
        await prisma.room.create({ data: r });
    }

    // Seed Menu Items
    const menuItems = [
        { name: "Masala Dosa", price: 80, category: "Food & Beverages", description: "Crispy rice crepe with potato filling" },
        { name: "Coffee", price: 30, category: "Food & Beverages", description: "Filter coffee" },
        { name: "Shirt Washing", price: 50, category: "Laundry", description: "Per piece washing" },
        { name: "Room Cleaning", price: 0, category: "Cleaning / Housekeeping", description: "Complimentary cleaning" },
    ];

    for (const m of menuItems) {
        await prisma.menuItem.create({ data: m });
    }

    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
