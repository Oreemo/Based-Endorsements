import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to redirect /manifest requests to the Farcaster hosted manifest URL.
 * Returns a 307 Temporary Redirect preserving the original request method.
 */
export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname === '/manifest') {
        return NextResponse.redirect(
            'https://api.farcaster.xyz/miniapps/hosted-manifest/019aabe6-232f-f6a0-d25e-edfd6fe5625d',
            307
        );
    }
    return NextResponse.next();
}

// Apply middleware only to the /manifest path.
export const config = {
    matcher: '/manifest',
};
