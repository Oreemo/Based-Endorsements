import { NextRequest, NextResponse } from 'next/server';
import { getAddress } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';
import { createPublicClient, http } from 'viem';

export const dynamic = 'force-dynamic';

// Create a public client with a reliable RPC
const publicClient = createPublicClient({
    chain: base,
    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://base.llamarpc.com'),
});

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');

    if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    try {
        // Normalize the name
        let fullName = name.toLowerCase().trim();
        if (!fullName.endsWith('.base.eth')) {
            fullName = `${fullName}.base.eth`;
        }

        console.log(`[API] Resolving Basename: ${fullName}`);

        // Use OnchainKit to resolve the address
        // We pass chain as any to avoid strict viem version mismatch issues
        const address = await getAddress({ name: fullName, chain: base as any });

        if (address) {
            console.log(`[API] Resolved ${fullName} to ${address}`);
            return NextResponse.json({ address });
        } else {
            console.log(`[API] Could not resolve ${fullName}`);
            return NextResponse.json({ error: 'Address not found' }, { status: 404 });
        }
    } catch (error: any) {
        console.error('[API] Error resolving basename:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message
        }, { status: 500 });
    }
}
