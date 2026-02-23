import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Guest routes are ALWAYS public
    if (pathname.startsWith('/guest')) {
        return NextResponse.next();
    }

    const isAdmin = request.cookies.get('admin_session')?.value === 'true';
    const isLoginPage = pathname === '/admin/login';

    // Protect all admin routes
    if (pathname.startsWith('/admin') && !isAdmin && !isLoginPage) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
