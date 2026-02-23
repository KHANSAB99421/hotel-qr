import { isAdmin } from '@/app/actions';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const authenticated = await isAdmin();

    // We allow the login page itself to be accessed
    // But we need to check the current path
    // Wait, layouts don't easily get the current path in Server Components
    // But login is a sub-route /admin/login
    // Actually, we can just check if authenticated and redirect if not
    // EXCEPT for /admin/login

    // However, if we put this layout in /admin/layout.tsx, it will also wrap /admin/login
    // If we want to skip the guard for /admin/login, we might need a different structure
    // or check if it's the login page.

    // A better way is to put the guard in a component and use it in specific pages,
    // or use a middleware, or use a (protected) group.

    // Let's use a simpler approach for now:
    // If we are in /admin/layout.tsx, it wraps EVERYTHING under /admin
    // If we are not authenticated, we redirect to /admin/login
    // BUT we must not redirect if we are already ON /admin/login to avoid loops.

    // Since we can't easily get the path in Server Layout, let's use a client-side approach 
    // or just put the check in each page.

    // Actually, I'll use a (dashboard) group or just protect the main pages.
    // Let's try to keep it simple: protect /admin/page.tsx and /admin/bill/[sessionId]/page.tsx

    return <>{children}</>;
}
